from codecarbon import EmissionsTracker
import sys

tracker = EmissionsTracker(project_name="ecocode_run", output_file="emissions.csv")
tracker.start()

try:
    print("Testing Carbon Matrix")
    for i in range(1000000):
        pass
finally:
    try:
        emissions = tracker.stop()
        print("===ECOCODE_METRICS===")
        print(emissions)
    except Exception as e:
        print("===ECOCODE_ERROR===")
        print(e)
