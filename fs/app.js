import { readdir, stat } from "fs/promises";
import path from "path";

const dirPath = "./test-data";

const analyseDirectory = async (currentPath) => {
  const entries = await readdir(currentPath, { withFileTypes: true });

  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        return await analyseDirectory(fullPath);
      } else if (entry.isFile) {
        const { size } = await stat(fullPath);
        return {
          fileCount: 1,
          totalSize: size,
          files: [{ path: fullPath, size }],
        };
      }

      return null;
    })
  );

  return results.filter(Boolean).reduce(
    (acc, curr) => ({
      fileCount: acc.fileCount + curr.fileCount,
      totalSize: acc.totalSize + curr.totalSize,
      files: acc.files.concat(curr.files),
    }),
    { fileCount: 0, totalSize: 0, files: [] }
  );
};

const endResult = await analyseDirectory(dirPath);
console.log(endResult);
