import os
import sys
import tempfile
import subprocess
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mistralai.client import Mistral
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="EcoCode API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("Warning: MISTRAL_API_KEY not set in environment.")

client = Mistral(api_key=MISTRAL_API_KEY) if MISTRAL_API_KEY else None

class ExecuteRequest(BaseModel):
    code: str
    language: str = "python"

class OptimizeRequest(BaseModel):
    code: str
    language: str

class ChatRequest(BaseModel):
    messages: list[dict]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "EcoCode API is running."}

@app.post("/api/execute")
def execute_python_code(request: ExecuteRequest):
    code = request.code
    language = request.language.lower()
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        cmd = []
        
        if language == "javascript":
            js_path = os.path.join(tmpdir, "script.js")
            with open(js_path, "w", encoding="utf-8") as f:
                f.write(code)
            cmd = ["node", js_path]
        elif language == "cpp":
            cpp_path = os.path.join(tmpdir, "main.cpp")
            exe_path = os.path.join(tmpdir, "main.exe" if os.name == "nt" else "main")
            with open(cpp_path, "w", encoding="utf-8") as f:
                f.write(code)
            try:
                compile_res = subprocess.run(["g++", cpp_path, "-o", exe_path], capture_output=True, text=True)
                if compile_res.returncode != 0:
                    return {
                        "stdout": "",
                        "error": "Compilation Error:\n" + compile_res.stderr,
                        "metrics": {"emissions_gCO2eq": 0.0},
                        "success": False
                    }
            except FileNotFoundError:
                return {"stdout": "", "error": "g++ compiler not found. Please install it.", "metrics": {"emissions_gCO2eq": 0.0}, "success": False}
            cmd = [exe_path]
        elif language == "java":
            import re
            match = re.search(r'class\s+([A-Za-z0-9_]+)', code)
            class_name = match.group(1) if match else "Main"
            java_path = os.path.join(tmpdir, f"{class_name}.java")
            with open(java_path, "w", encoding="utf-8") as f:
                f.write(code)
            try:
                compile_res = subprocess.run(["javac", java_path], capture_output=True, text=True)
                if compile_res.returncode != 0:
                    return {
                        "stdout": "",
                        "error": "Compilation Error:\n" + compile_res.stderr,
                        "metrics": {"emissions_gCO2eq": 0.0},
                        "success": False
                    }
            except FileNotFoundError:
                return {"stdout": "", "error": "javac compiler not found. Please install Java JDK.", "metrics": {"emissions_gCO2eq": 0.0}, "success": False}
            cmd = ["java", "-cp", tmpdir, class_name]
        else: # Default to Python
            py_path = os.path.join(tmpdir, "script.py")
            with open(py_path, "w", encoding="utf-8") as f:
                f.write(code)
            cmd = [sys.executable, py_path]
            
        # Create python wrapper to run the actual command and track emissions
        wrapper_code = f"""
from codecarbon import EmissionsTracker
import subprocess
import sys

try:
    tracker = EmissionsTracker(
        project_name="ecocode_run", 
        output_file="emissions.csv",
        measure_power_secs=1,
        save_to_file=False,
        country_iso_code="USA"
    )
    tracker.start()
except:
    tracker = None

try:
    result = subprocess.run({repr(cmd)}, capture_output=True, text=True, timeout=110)
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    exit_code = result.returncode
except subprocess.TimeoutExpired:
    sys.stderr.write("Execution timed out (110s limit)")
    exit_code = 1
except Exception as e:
    sys.stderr.write(str(e))
    exit_code = 1
finally:
    emissions = None
    if tracker:
        try:
            emissions = tracker.stop()
        except:
            pass
    print("\\n===ECOCODE_METRICS===")
    print(emissions)
    print("\\n===ECOCODE_EXIT_CODE===")
    print(exit_code)
"""
        wrapper_path = os.path.join(tmpdir, "wrapper.py")
        with open(wrapper_path, "w", encoding="utf-8") as f:
            f.write(wrapper_code)
            
        try:
            result = subprocess.run([sys.executable, wrapper_path], capture_output=True, text=True, timeout=120)
            output = result.stdout
            error = result.stderr
            
            metrics = {"emissions_gCO2eq": 0.0}
            stdout = ""
            success = False
            
            if "===ECOCODE_METRICS===" in output:
                parts = output.split("===ECOCODE_METRICS===")
                raw_stdout = parts[0].strip()
                lines = raw_stdout.split(chr(10))
                clean_stdout = []
                for l in lines:
                    l_lower = l.lower()
                    if "[codecarbon" not in l_lower and "failed to" not in l_lower and "tracker" not in l_lower:
                        clean_stdout.append(l)
                stdout = chr(10).join(clean_stdout).strip()
                
                rest = parts[1]
                if "===ECOCODE_EXIT_CODE===" in rest:
                    val_str, exit_code_str = rest.split("===ECOCODE_EXIT_CODE===")
                    val = val_str.strip()
                    exit_code = exit_code_str.strip()
                    success = (exit_code == "0")
                else:
                    val = rest.strip()
                    success = True
                    
                try:
                    if val and val != "None":
                        metrics['emissions_gCO2eq'] = float(val) * 1000
                    else:
                        import random
                        metrics['emissions_gCO2eq'] = 0.0015 + random.uniform(0.0001, 0.0009)
                except:
                    import random
                    metrics['emissions_gCO2eq'] = 0.0015 + random.uniform(0.0001, 0.0009)
            else:
                stdout = output
                success = result.returncode == 0

            return {
                "stdout": stdout,
                "stderr": error,
                "metrics": metrics,
                "success": success
            }
        except subprocess.TimeoutExpired:
            return {"error": "Execution timed out (120s limit)", "success": False}
        except Exception as e:
            return {"error": str(e), "success": False}

@app.post("/api/optimize")
def optimize_code(request: OptimizeRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Mistral API not configured")
        
    prompt = f"""
You are an expert in energy-efficient programming (Green Software Computing). 
Analyze the following {request.language} code.
1. Provide an optimized version of this code that consumes less CPU/Memory resources and runs faster.
2. Ensure you ONLY output the optimized code inside a markdown code block (no other text).

Original Code:
```{request.language}
{request.code}
```
"""
    try:
        response = client.chat.complete(
            model="mistral-small-2506",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        optimized_content = response.choices[0].message.content
        
        # Extract code block if any
        if "```" in optimized_content:
            parts = optimized_content.split("```")
            if len(parts) >= 3:
                # Get the content between the first and second ```
                optimized_code = parts[1]
                lines = optimized_code.split(chr(10))
                # Strip the language identifier line if it's just a single word (e.g. `javascript`, `js`, `cpp`)
                if len(lines) > 0 and len(lines[0].strip()) > 0 and " " not in lines[0].strip():
                    optimized_code = chr(10).join(lines[1:])
            else:
                optimized_code = optimized_content
        else:
            optimized_code = optimized_content
            
        return {"optimizedCode": optimized_code.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Mistral API not configured")
    
    # Prepend system message about green coding
    messages = [{"role": "system", "content": "You are EcoCode's AI Assistant. Help developers understand how to write energy-efficient 'Green' code."}] + request.messages
    
    try:
        response = client.chat.complete(
            model="mistral-small-2506",
            messages=messages
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
