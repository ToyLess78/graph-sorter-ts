import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';
import * as os from 'os';

// Validate the input file
const validateFile = (filePath: string): string[] => {
    if (path.extname(filePath) !== '.txt') {
        throw new Error("Invalid file format. The file must be a .txt file.");
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`The file '${filePath}' does not exist.`);
    }

    const lines = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .map(line => line.trim());

    lines.forEach(line => {
        if (!/^\d{6}$/.test(line)) {
            throw new Error(`Invalid line in file: '${line}'. Each line must be a 6-digit number.`);
        }
    });

    console.log("File validation successful.");
    return lines;
};

// Build a graph where each piece connects to others
const buildGraph = (pieces: string[]): Map<string, string[]> => {
    const graph = new Map<string, string[]>();

    pieces.forEach((piece1, i) =>
        pieces.forEach((piece2, j) => {
            if (i !== j && piece1.slice(-2) === piece2.slice(0, 2)) {
                const connections = graph.get(piece1) || [];
                connections.push(piece2);
                graph.set(piece1, connections);
            }
        })
    );

    return graph;
};

// Find the longest path in the graph using BFS
const findLongestPath = (graph: Map<string, string[]>, startPiece: string): string[] => {
    const queue: [string, string[]][] = [[startPiece, [startPiece]]];
    let longestPath: string[] = [];

    while (queue.length > 0) {
        const [current, path] = queue.shift()!;
        if (path.length > longestPath.length) {
            longestPath = path;
        }

        const neighbors = (graph.get(current) || []).sort((a, b) =>
            (graph.get(b)?.length || 0) - (graph.get(a)?.length || 0) || a.localeCompare(b)
        );

        neighbors.forEach(neighbor => {
            if (!path.includes(neighbor) && current.slice(-2) === neighbor.slice(0, 2)) {
                queue.push([neighbor, [...path, neighbor]]);
            }
        });
    }

    return longestPath;
};

// Improve the sequence by including remaining elements with strict validation
const improveWithRemaining = (pieces: string[], mainSequence: string[]): string[] => {
    const used = new Set(mainSequence);
    const remaining = pieces.filter(piece => !used.has(piece)).sort();

    remaining.forEach(piece => {
        if (mainSequence[mainSequence.length - 1].slice(-2) === piece.slice(0, 2)) {
            mainSequence.push(piece);
        } else if (mainSequence[0].slice(0, 2) === piece.slice(-2)) {
            mainSequence.unshift(piece);
        }
    });

    return mainSequence;
};

// Validate the final sequence
const validateSequence = (sequence: string[]): [boolean, number] => {
    const invalidIndex = sequence.findIndex((item, i) =>
        i < sequence.length - 1 && item.slice(-2) !== sequence[i + 1].slice(0, 2)
    );

    return invalidIndex === -1 ? [true, -1] : [false, invalidIndex];
};


// Merge the sequence into a single number string
const mergeSequence = (sequence: string[]): string =>
    sequence.reduce((merged, current, i) =>
        i === 0 ? current : merged + current.slice(2), '');

// Save the sorted sequence to a file
const saveSequenceToFile = (sequence: string[], outputFilePath: string): void => {
    fs.writeFileSync(outputFilePath, sequence.join('\n'));
    console.log(`Sorted sequence saved to ${outputFilePath}`);
};

// CPU measurement helper
const getCPUTime = (): number =>
    os.cpus().reduce((total, cpu) => total + cpu.times.user + cpu.times.sys, 0);


const filePath = './source.txt';
const outputFilePath = './sortedlist.txt';

try {
    // Start measuring performance
    const startCPUTime = getCPUTime();
    const startTime = performance.now();
    const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024;

    const numbers = validateFile(filePath);

    const graph = buildGraph(numbers);

    const startPiece = numbers.reduce((min, piece) =>
        graph.get(piece)?.length === 1 && (min === "" || piece < min) ? piece : min, numbers[0]);

    const longestPath = findLongestPath(graph, startPiece);

    const finalSequence = improveWithRemaining(numbers, longestPath);

    const [isValid, errorIndex] = validateSequence(finalSequence);

    const mergedSequence = mergeSequence(finalSequence);

    const endCPUTime = getCPUTime();
    const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024;
    const endTime = performance.now();

    console.log(`Total pieces: ${finalSequence.length}`);
    console.log(`Sequence is valid: ${isValid}`);
    if (!isValid) {
        console.log(`Error at index ${errorIndex}: ${finalSequence[errorIndex]} -> ${finalSequence[errorIndex + 1]}`);
    } else {
        console.log("The sequence is fully valid.");
    }
    console.log(`Final sequence: ${mergedSequence}`);
    console.log(`Execution time: ${(endTime - startTime).toFixed(2)} ms`);
    console.log(`CPU time used: ${(endCPUTime - startCPUTime) / 1000} seconds`);
    console.log(`Memory used: ${(memoryAfter - memoryBefore).toFixed(2)} MB`);

    // Save the final sequence to a file
    if (isValid) {
        saveSequenceToFile(finalSequence, outputFilePath);
    } else {
        console.log("The sequence is invalid. Not saving to file.");
    }

} catch (error) {
    console.error(error);
}
