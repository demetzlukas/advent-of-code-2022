import { readLinesFromInput } from '../utils/readFile';

type File = {
  name: string;
  size: number;
};

type Folder = {
  name: string;
  subfolders: Folder[];
  files: File[];
  size: number;
};

const filename = './input/7.txt';

export async function main() {
  const input = await readLinesFromInput(filename);
  const root: Folder = { name: '', subfolders: [], files: [], size: 0 };
  createDirectoryTree(input, root);
  calculateFolderSizes(root);

  console.log('Part 1:', findFolderBelowThreshold(root, 100000));

  const diskSize = 70000000;
  const required = 30000000;
  const free = diskSize - root.size;

  console.log(
    'Part 2:',
    getFolderSizes(root)
      .filter((size) => size > required - free)
      .sort((a, b) => b - a)
      .pop()
  );
}

function getFolderSizes(folder: Folder) {
  const size = [];
  size.push(folder.size);
  size.push(
    ...folder.subfolders.flatMap((subfolder) => getFolderSizes(subfolder))
  );

  return size;
}

function findFolderBelowThreshold(folder: Folder, threshold: number): number {
  let sum = 0;

  if (folder.size <= threshold) {
    sum = folder.size;
  }

  sum += folder.subfolders
    .map((subfolder) => findFolderBelowThreshold(subfolder, threshold))
    .reduce((sum, current) => sum + current, 0);

  return sum;
}

function calculateFolderSizes(folder: Folder) {
  if (folder.files.length > 0) {
    folder.size = folder.files
      .map((file) => file.size)
      .reduce((sum, current) => sum + current);
  }

  if (folder.subfolders.length > 0) {
    folder.size += folder.subfolders
      .map((folder) => calculateFolderSizes(folder))
      .reduce((sum, current) => sum + current);
  }

  return folder.size;
}

function createDirectoryTree(lines: string[], folder: Folder) {
  while (true) {
    if (lines.length === 0) {
      return;
    }
    if (lines[0] === '$ cd ..') {
      lines.shift();
      return;
    }
    if (lines[0] === '$ ls') {
      lines.shift();
      folder.files = [...ls(lines)];
    } else if (lines[0].startsWith('$ cd')) {
      const newFolder: Folder = {
        name: '',
        subfolders: [],
        files: [],
        size: 0,
      };
      const [_, __, name] = lines.shift().split(' ');
      newFolder.name = name;
      folder.subfolders.push(newFolder);
      createDirectoryTree(lines, newFolder);
    }
  }
}

function ls(lines: string[]): File[] {
  const files: File[] = [];

  while (true) {
    if (lines.length == 0) {
      return files;
    }
    if (lines[0].startsWith('$')) {
      return files;
    }
    const line = lines.shift();
    if (line.startsWith('dir')) {
      continue;
    }
    const [size, name] = line.split(' ');
    const file: File = { name, size: Number(size) };
    files.push(file);
  }
}
