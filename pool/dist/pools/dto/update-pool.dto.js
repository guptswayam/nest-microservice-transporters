"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePoolDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pool_dto_1 = require("./create-pool.dto");
class UpdatePoolDto extends (0, mapped_types_1.PartialType)(create_pool_dto_1.CreatePoolDto) {
}
exports.UpdatePoolDto = UpdatePoolDto;
//# sourceMappingURL=update-pool.dto.js.map