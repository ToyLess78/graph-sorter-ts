# Graph Sorter (TypeScript)

This TypeScript project implements a graph-based sorting algorithm to find the longest sequence of 6-digit numbers. Each number starts with the last two digits of the previous number. The script also provides performance metrics, including execution time, CPU usage, and memory consumption.

---

## Features

- **Graph-based sorting**: Constructs a graph to find the longest valid sequence of numbers.
- **Validation**: Ensures the input file meets the required format and checks sequence correctness.
- **Performance metrics**: Tracks execution time, CPU usage, and memory consumption.
- **File output**: Saves the sorted sequence and merged sequence as a single number string.

---

## Requirements

- Node.js (version 14+ recommended)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ToyLess78/graph-sorter-ts.git
   cd graph-sorter-ts
   
2. Install dependencies:
   ```bash
   npm install

## Input File Format
The input file (source.txt) must contain 6-digit numbers, one per line.
Example:
   ```bash
   123456
   564738
   384950
```

## Usage
Place your input file (source.txt) in the project directory.

Compile the TypeScript file to JavaScript:

   ```bash
npx tsc
```
Run the compiled script:

   ```bash
node graphSorter.js
```

## Outputs:

The sorted sequence will be saved in sortedlist.txt.
Performance metrics (execution time, CPU time, and memory usage) will be displayed in the console.

## Troubleshooting
1. File Not Found: Ensure the input file source.txt exists in the project directory and has the correct format.

2. Invalid File Format: The input file must be a .txt file, and each line must contain a 6-digit number.

3. TypeScript Compilation Error: Ensure you have TypeScript installed globally:

```bash
npm install -g typescript
```

4. Error during runtime: Ensure you are using the correct Node.js version (14 or higher).

## Performance Metrics
- Execution Time: Total time to process the file and compute the sequence.
- CPU Time: Time spent on CPU operations (user + system time).
- Memory Usage: Difference in memory usage before and after execution.


## Author
Bilenko Tetiana


