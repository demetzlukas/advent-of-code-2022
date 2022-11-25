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
exports.readLinesFromInput = exports.readFileFromInput = void 0;
const promises_1 = require("fs/promises");
function readFileFromInput(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield (0, promises_1.readFile)(input, 'utf-8');
        return content.trim();
    });
}
exports.readFileFromInput = readFileFromInput;
function readLinesFromInput(input, lineEnd = '\r\n') {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield readFileFromInput(input);
        return content.split(lineEnd);
    });
}
exports.readLinesFromInput = readLinesFromInput;
//# sourceMappingURL=readFile.js.map