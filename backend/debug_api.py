import requests

user_code = """
import time

def useless_calculation(n):
    result = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                result += (i * j * k) % (n + 1)
    return result

def inefficient_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            time.sleep(0.001)
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def main():
    print("Starting heavy...")
    start_time = time.time()
    val = useless_calculation(50)
    data = [i for i in range(100, 0, -1)]
    sorted_data = inefficient_sort(data)
    
    def slow_fibonacci(n):
        if n <= 1: return n
        return slow_fibonacci(n-1) + slow_fibonacci(n-2)
    
    print("Fibonacci(30):", slow_fibonacci(30))
    end_time = time.time()
    print("Time:", end_time - start_time)

if __name__ == "__main__":
    main()
"""

try:
    print("Sending request to execute API...")
    res = requests.post(
        "http://localhost:8000/api/execute",
        json={"code": user_code},
        timeout=120
    )
    print("Status Code:", res.status_code)
    print("Response JSON:", res.json())
except Exception as e:
    print("Exception:", e)
