import fs from "fs/promises";
import path from "path";

async function saveConfig(args: string[]) {
  const paintletName = args[2] || "";

  try {
    if (paintletName.length === 0) {
      throw new Error("Paintlet name is required");
    }

    const thisPath = new URL(".", import.meta.url).pathname;
    const configPath = `../paintlets/${paintletName}/src/config.ts`;
    const destPath = `../public/data/${paintletName}.json`;
    const { defaultProps } = await import(path.resolve(thisPath, configPath));
    const json = JSON.stringify(defaultProps, null, 2);
    await fs.writeFile(path.resolve(thisPath, destPath), json);
    console.log(`${paintletName}.json saved`);
  } catch (error) {
    console.error(error);
  }
}

saveConfig(process.argv);
