"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const readFile_1 = require("../utils/readFile");
const filename = './input/.txt';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield (0, readFile_1.readLinesFromInput)(filename);
        console.log('Part 1:');
        console.log('Part 2:');
    });
}
exports.main = main;
//# sourceMappingURL=index.js.map