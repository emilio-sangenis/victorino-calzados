// Genera un hash bcrypt seguro para almacenar la contraseña administrativa sin guardar el texto original.
import bcrypt from "bcryptjs";
import readline from "node:readline";

const interfaceReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interfaceReader.question(
  "Contraseña administrativa: ",
  async (password) => {
    const hash = await bcrypt.hash(password, 12);

    console.log("");
    console.log("Hash generado:");
    console.log(hash);

    interfaceReader.close();
  }
);