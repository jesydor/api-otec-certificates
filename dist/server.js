"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./interfaces/routes"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/', routes_1.default);
app.listen(port, () => {
    console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
