"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron6 = require("electron");
var import_node_path3 = __toESM(require("node:path"));

// src/domains/auth/auth.types.ts
var AUTH_IPC_CHANNELS = {
  getSession: "auth:getSession",
  startSession: "auth:startSession",
  register: "auth:register",
  login: "auth:login",
  logout: "auth:logout"
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path4, errorMaps, issueData } = params;
  const fullPath = [...path4, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path4, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path4;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;

// src/domains/auth/auth.schema.ts
var UserSchema = external_exports.object({
  id: external_exports.string(),
  email: external_exports.string().email(),
  displayName: external_exports.string(),
  passwordHash: external_exports.string(),
  createdAt: external_exports.number(),
  updatedAt: external_exports.number()
});
var AuthSessionSchema = external_exports.object({
  user: UserSchema,
  token: external_exports.string(),
  createdAt: external_exports.number(),
  expiresAt: external_exports.number()
});
var StartSessionInputSchema = external_exports.object({
  displayName: external_exports.string().min(1).max(64).optional(),
  email: external_exports.string().email().optional(),
  username: external_exports.string().min(1).max(64).optional()
});
var GetSessionResponseSchema = external_exports.object({
  session: AuthSessionSchema.nullable()
});
var StartSessionResponseSchema = external_exports.object({
  session: AuthSessionSchema
});

// src/domains/auth/auth.service.ts
var import_electron = require("electron");
var import_fs = require("fs");
var import_node_path = __toESM(require("node:path"));
var import_node_crypto = require("node:crypto");

// node_modules/bcryptjs/index.js
var nextTick = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

// src/domains/auth/auth.service.ts
var SESSION_FILE_NAME = "auth-session.json";
function getSessionFilePath() {
  const userData = import_electron.app.getPath("userData");
  return import_node_path.default.join(userData, SESSION_FILE_NAME);
}
async function loadSession() {
  const filePath = getSessionFilePath();
  try {
    const raw = await import_fs.promises.readFile(filePath, "utf-8");
    const json = JSON.parse(raw);
    const session = AuthSessionSchema.parse(json);
    if (Date.now() > session.expiresAt) {
      await clearSession();
      return null;
    }
    return session;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
async function startNewSession(displayName, email, username) {
  const session = {
    user: {
      id: (0, import_node_crypto.randomUUID)(),
      email: email || "",
      displayName: displayName || "Guest User",
      passwordHash: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    token: (0, import_node_crypto.randomUUID)(),
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1e3
    // 24 hours
  };
  const filePath = getSessionFilePath();
  await import_fs.promises.mkdir(import_node_path.default.dirname(filePath), { recursive: true });
  await import_fs.promises.writeFile(filePath, JSON.stringify(session), { encoding: "utf-8" });
  return session;
}
async function clearSession() {
  const filePath = getSessionFilePath();
  try {
    await import_fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}
async function upsertUserGlobal(db2, email, displayName, username) {
  try {
    const existingUser = db2.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      db2.prepare(`
        UPDATE users 
        SET display_name = ?, username = ?, updated_at = ?
        WHERE email = ?
      `).run(displayName, username, Date.now(), email);
      const updatedUser = db2.prepare("SELECT * FROM users WHERE email = ?").get(email);
      const user = {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.display_name,
        passwordHash: updatedUser.password_hash,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at
      };
      return {
        success: true,
        user
      };
    } else {
      const user = {
        id: (0, import_node_crypto.randomUUID)(),
        email,
        displayName,
        passwordHash: "demo_hash",
        // Default hash for demo users
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      db2.prepare(`
        INSERT INTO users (id, email, display_name, username, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        user.email,
        user.displayName,
        username,
        user.passwordHash,
        user.createdAt,
        user.updatedAt
      );
      return {
        success: true,
        user
      };
    }
  } catch (error) {
    console.error("Upsert user error:", error);
    return {
      success: false,
      error: "Failed to upsert user"
    };
  }
}

// src/domains/auth/auth.ipc.ts
function registerAuthIpcHandlers(ipcMain6, db2) {
  ipcMain6.handle(AUTH_IPC_CHANNELS.getSession, async () => {
    const session = await loadSession();
    return GetSessionResponseSchema.parse({ session });
  });
  ipcMain6.handle(
    AUTH_IPC_CHANNELS.startSession,
    async (_event, rawPayload) => {
      const payload = StartSessionInputSchema.parse(rawPayload);
      const session = await startNewSession(payload.displayName);
      if (db2 && payload.email && payload.displayName) {
        try {
          const username = payload.username || payload.email?.split("@")[0] || "user";
          await upsertUserGlobal(db2, payload.email, payload.displayName, username);
        } catch (error) {
          console.error("Failed to upsert user globally:", error);
        }
      }
      return StartSessionResponseSchema.parse({ session });
    }
  );
  ipcMain6.handle("auth:upsertUser", async (_event, { email, displayName, username }) => {
    if (!db2) {
      return { success: false, error: "Database not available" };
    }
    return await upsertUserGlobal(db2, email, displayName, username);
  });
}

// src/domains/messages/messages.ipc.ts
var import_electron2 = require("electron");

// src/domains/messages/messages.types.ts
var MESSAGES_IPC_CHANNELS = {
  INSERT_MESSAGE: "smd:messages:insert",
  LIST_MESSAGES: "smd:messages:list"
};

// src/domains/messages/messages.service.ts
async function insertMessage(payload) {
  const now = Date.now();
  const message = {
    id: `msg_${now}_${Math.random().toString(36).substr(2, 9)}`,
    chat_id: payload.chat_id,
    sender: payload.sender,
    recipient: payload.recipient,
    content: payload.content,
    timestamp: now,
    read_at: now,
    is_edited: false
  };
  return message;
}
async function listMessages(chatId) {
  return [];
}

// src/domains/messages/messages.ipc.ts
var InsertMessageSchema = external_exports.object({
  chat_id: external_exports.string(),
  sender: external_exports.string(),
  recipient: external_exports.string(),
  content: external_exports.string().min(1)
});
var ListMessagesSchema = external_exports.object({
  chat_id: external_exports.string()
});
function registerMessageIpc() {
  import_electron2.ipcMain.handle(MESSAGES_IPC_CHANNELS.INSERT_MESSAGE, async (_event, raw) => {
    const parsed = InsertMessageSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid insertMessage payload");
    }
    return await insertMessage(parsed.data);
  });
  import_electron2.ipcMain.handle(MESSAGES_IPC_CHANNELS.LIST_MESSAGES, async (_event, raw) => {
    const parsed = ListMessagesSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid listMessages payload");
    }
    return await listMessages(parsed.data.chat_id);
  });
}

// src/domains/sync/sync.ipc.ts
var import_electron3 = require("electron");

// src/domains/sync/sync.types.ts
var SYNC_IPC_CHANNELS = {
  TYPING_EVENT: "smd:sync:typing",
  PRESENCE_EVENT: "smd:sync:presence",
  SEARCH_CHATS: "smd:sync:searchChats"
};

// src/domains/sync/sync.service.ts
var typingState = /* @__PURE__ */ new Map();
function addTypingUser(chatId, username) {
  if (!typingState.has(chatId)) {
    typingState.set(chatId, /* @__PURE__ */ new Set());
  }
  typingState.get(chatId).add(username);
}
function removeTypingUser(chatId, username) {
  typingState.get(chatId)?.delete(username);
  if (typingState.get(chatId)?.size === 0) {
    typingState.delete(chatId);
  }
}

// src/domains/sync/sync.ipc.ts
var TypingEventSchema = external_exports.object({
  chatId: external_exports.string(),
  username: external_exports.string(),
  type: external_exports.enum(["start", "stop"]),
  timestamp: external_exports.number()
});
var PresenceEventSchema = external_exports.object({
  username: external_exports.string(),
  status: external_exports.enum(["online", "offline"]),
  timestamp: external_exports.number()
});
var SearchChatsSchema = external_exports.object({
  query: external_exports.string()
});
function registerSyncIpc() {
  import_electron3.ipcMain.handle(SYNC_IPC_CHANNELS.TYPING_EVENT, async (_event, raw) => {
    const parsed = TypingEventSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid typing event payload");
    }
    const { chatId, username, type } = parsed.data;
    if (type === "start") {
      addTypingUser(chatId, username);
    } else {
      removeTypingUser(chatId, username);
    }
    return { success: true };
  });
  import_electron3.ipcMain.handle(SYNC_IPC_CHANNELS.PRESENCE_EVENT, async (_event, raw) => {
    const parsed = PresenceEventSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid presence event payload");
    }
    return { success: true };
  });
  import_electron3.ipcMain.handle(SYNC_IPC_CHANNELS.SEARCH_CHATS, async (_event, raw) => {
    const parsed = SearchChatsSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error("Invalid searchChats payload");
    }
    return { chats: [], total: 0 };
  });
}

// src/domains/chats/chats.ipc.ts
var import_electron4 = require("electron");

// src/domains/chats/chats.service.ts
function getChats(db2, request) {
  if (!db2) {
    throw new Error("Database not initialized");
  }
  const { offset, limit } = request;
  try {
    const totalResult = db2.prepare("SELECT COUNT(*) as count FROM chats").get();
    const total = totalResult.count;
    const chats = db2.prepare(`
      SELECT 
        id,
        name,
        last_message,
        updated_at,
        COALESCE(unread_count, 0) as unread_count
      FROM chats
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    const hasMore = offset + chats.length < total;
    return {
      chats,
      total,
      hasMore
    };
  } catch (error) {
    console.error("Error in getChats service:", error);
    throw error;
  }
}

// src/domains/chats/chats.mock.ts
var mockChats = [
  {
    id: "1",
    name: "Alice Johnson",
    last_message: "Hey, are you free later?",
    updated_at: Date.now() - 1e3 * 60,
    unread_count: 2
  },
  {
    id: "2",
    name: "Bob Smith",
    last_message: "Thanks for the help!",
    updated_at: Date.now() - 1e3 * 60 * 5,
    unread_count: 0
  },
  {
    id: "3",
    name: "Team Chat",
    last_message: "Meeting at 3pm",
    updated_at: Date.now() - 1e3 * 60 * 15,
    unread_count: 5
  },
  {
    id: "4",
    name: "Carol White",
    last_message: "Can you review this?",
    updated_at: Date.now() - 1e3 * 60 * 30,
    unread_count: 1
  },
  {
    id: "5",
    name: "David Brown",
    last_message: "Great work on the project",
    updated_at: Date.now() - 1e3 * 60 * 60,
    unread_count: 0
  }
];
var mockMessages = {
  "1": [
    {
      id: "m1",
      chat_id: "1",
      sender: "Alice Johnson",
      content: "Hey, are you free later?",
      timestamp: Date.now() - 1e3 * 60 * 10,
      is_read: false,
      is_edited: false
    },
    {
      id: "m2",
      chat_id: "1",
      sender: "You",
      content: "Sure, what's up?",
      timestamp: Date.now() - 1e3 * 60 * 8,
      is_read: true,
      is_edited: false
    },
    {
      id: "m3",
      chat_id: "1",
      sender: "Alice Johnson",
      content: "Want to grab coffee?",
      timestamp: Date.now() - 1e3 * 60 * 5,
      is_read: false,
      is_edited: false
    },
    {
      id: "m4",
      chat_id: "1",
      sender: "Alice Johnson",
      content: "Hey, are you free later?",
      timestamp: Date.now() - 1e3 * 60,
      is_read: false,
      is_edited: false
    }
  ],
  "2": [
    {
      id: "m5",
      chat_id: "2",
      sender: "Bob Smith",
      content: "Thanks for the help!",
      timestamp: Date.now() - 1e3 * 60 * 5,
      is_read: true,
      is_edited: false
    }
  ],
  "3": [
    {
      id: "m6",
      chat_id: "3",
      sender: "Carol",
      content: "Meeting at 3pm",
      timestamp: Date.now() - 1e3 * 60 * 15,
      is_read: false,
      is_edited: false
    },
    {
      id: "m7",
      chat_id: "3",
      sender: "David",
      content: "I'll be there",
      timestamp: Date.now() - 1e3 * 60 * 12,
      is_read: false,
      is_edited: false
    },
    {
      id: "m8",
      chat_id: "3",
      sender: "You",
      content: "Sounds good!",
      timestamp: Date.now() - 1e3 * 60 * 10,
      is_read: false,
      is_edited: false
    }
  ]
};
function getChatsMock(request) {
  const { offset, limit } = request;
  const sortedChats = [...mockChats].sort((a, b) => b.updated_at - a.updated_at);
  const paginatedChats = sortedChats.slice(offset, offset + limit);
  const total = sortedChats.length;
  const hasMore = offset + paginatedChats.length < total;
  return {
    chats: paginatedChats,
    total,
    hasMore
  };
}

// src/domains/chats/chats.types.ts
var CHATS_IPC_CHANNELS = {
  GET_CHATS: "chats:getChats"
};

// src/domains/chats/chats.ipc.ts
var GetChatsRequestSchema = external_exports.object({
  offset: external_exports.number().int().min(0),
  limit: external_exports.number().int().min(1).max(100)
});
function registerChatsIpc(db2) {
  import_electron4.ipcMain.handle(CHATS_IPC_CHANNELS.GET_CHATS, async (_event, rawRequest) => {
    try {
      const request = GetChatsRequestSchema.parse(rawRequest);
      if (!db2) {
        console.log("Using mock data - database not initialized");
        const result2 = getChatsMock(request);
        return {
          success: true,
          data: result2
        };
      }
      const result = getChats(db2, request);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error("Error in getChats IPC:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  });
}

// electron/wsClient.ts
var import_events = require("events");
var WebSocket = eval("require")("ws");
var WebSocketClient = class extends import_events.EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
    this.pongTimeout = null;
    this.config = {
      url: process.env.WS_URL || "ws://localhost:8080",
      heartbeatInterval: 1e4,
      // 10 seconds (as per requirements)
      pongTimeout: 5e3,
      // 5 seconds
      reconnectBaseDelay: 1e3,
      // 1 second
      reconnectMaxDelay: 3e4,
      // 30 seconds
      maxReconnectAttempts: 10
    };
    this.status = {
      status: "offline",
      reconnectAttempts: 0
    };
    this.isShuttingDown = false;
  }
  /**
   * Start WebSocket connection with automatic reconnect
   */
  async connect() {
    if (this.isShuttingDown)
      return;
    console.log(`[WS] Connecting to ${this.config.url}`);
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Connection timeout"));
        }, 1e4);
        this.ws.on("open", () => {
          clearTimeout(timeout);
          resolve();
        });
        this.ws.on("error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    } catch (error) {
      console.error("[WS] Connection failed:", error);
      this.handleConnectionLost();
      throw error;
    }
  }
  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    if (!this.ws)
      return;
    this.ws.on("open", () => {
      console.log("[WS] Connected successfully");
      this.updateStatus({ status: "connected", lastConnected: Date.now(), reconnectAttempts: 0 });
      this.startHeartbeat();
      this.emit("connected");
    });
    this.ws.on("message", (data) => {
      try {
        const event = JSON.parse(data.toString());
        this.handleIncomingEvent(event);
      } catch (error) {
        console.error("[WS] Failed to parse message:", error);
      }
    });
    this.ws.on("close", (code, reason) => {
      console.log(`[WS] Connection closed: ${code} - ${reason.toString()}`);
      this.cleanup();
      if (!this.isShuttingDown) {
        this.handleConnectionLost();
      }
    });
    this.ws.on("error", (error) => {
      console.error("[WS] WebSocket error:", error);
      this.emit("error", error);
    });
    this.ws.on("pong", () => {
      console.log("[WS] Received pong");
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
        this.pongTimeout = null;
      }
    });
  }
  /**
   * Handle incoming sync events and emit for processing
   */
  handleIncomingEvent(event) {
    const eventId = "id" in event.payload ? event.payload.id : "chat_id" in event.payload ? event.payload.chat_id : "unknown";
    console.log(`[WS] Received ${event.type} event (id: ${eventId})`);
    this.emit("syncEvent", event);
  }
  /**
   * Start heartbeat mechanism
   */
  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === this.ws.OPEN) {
        console.log("[WS] Sending ping");
        this.ws.ping();
        this.pongTimeout = setTimeout(() => {
          console.error("[WS] Pong timeout - connection unhealthy");
          this.ws?.close();
        }, this.config.pongTimeout);
      }
    }, this.config.heartbeatInterval);
  }
  /**
   * Handle connection loss with exponential backoff
   */
  handleConnectionLost() {
    this.updateStatus({ status: "reconnecting" });
    this.emit("disconnected");
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    const delay = Math.min(
      this.config.reconnectBaseDelay * Math.pow(2, this.status.reconnectAttempts || 0),
      this.config.reconnectMaxDelay
    );
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${(this.status.reconnectAttempts || 0) + 1})`);
    this.reconnectTimeout = setTimeout(async () => {
      if ((this.status.reconnectAttempts || 0) >= this.config.maxReconnectAttempts) {
        console.error("[WS] Max reconnect attempts reached");
        this.updateStatus({ status: "offline", reconnectAttempts: 0 });
        this.emit("maxReconnectAttemptsReached");
        return;
      }
      this.updateStatus({ reconnectAttempts: (this.status.reconnectAttempts || 0) + 1 });
      try {
        await this.connect();
      } catch (error) {
        console.error("[WS] Reconnect failed:", error);
        this.handleConnectionLost();
      }
    }, delay);
  }
  /**
   * Update connection status and emit change
   */
  updateStatus(updates) {
    this.status = { ...this.status, ...updates };
    console.log("[WS] Status updated:", this.status);
    this.emit("statusChange", this.status);
  }
  /**
   * Get current connection status
   */
  getStatus() {
    return { ...this.status };
  }
  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  /**
   * Graceful shutdown
   */
  async disconnect() {
    this.isShuttingDown = true;
    this.cleanup();
    if (this.ws) {
      this.ws.close(1e3, "Client disconnecting");
      this.ws = null;
    }
    this.updateStatus({ status: "offline", reconnectAttempts: 0 });
    console.log("[WS] Disconnected gracefully");
  }
  /**
   * Simulate connection drop for testing reconnection logic
   * This will close the connection abruptly to trigger reconnection
   */
  async simulateDisconnect() {
    console.log("[WS] Simulating connection drop...");
    if (this.ws) {
      this.ws.close(1006, "Simulated connection drop");
      this.ws = null;
    }
    this.handleConnectionLost();
  }
  /**
   * Force immediate reconnection attempt
   */
  async forceReconnect() {
    console.log("[WS] Forcing reconnection...");
    this.updateStatus({ reconnectAttempts: 0 });
    this.cleanup();
    if (this.ws) {
      this.ws.close(1e3, "Forcing reconnect");
      this.ws = null;
    }
    await this.connect();
  }
};

// electron/db/yqueries.ts
var DEFAULT_CURRENT_USER = "You";
var MessageEventSchema = external_exports.object({
  id: external_exports.string(),
  chat_id: external_exports.string(),
  sender: external_exports.string(),
  recipient: external_exports.string(),
  content: external_exports.string(),
  timestamp: external_exports.number(),
  read_at: external_exports.number().nullable().optional(),
  is_read: external_exports.boolean().optional(),
  is_edited: external_exports.boolean().optional(),
  type: external_exports.enum(["text", "image", "file"]).optional(),
  file_path: external_exports.string().nullable().optional(),
  file_name: external_exports.string().nullable().optional(),
  file_size: external_exports.number().nullable().optional(),
  mime_type: external_exports.string().nullable().optional()
});
var ChatUpdateEventSchema = external_exports.object({
  chat_id: external_exports.string(),
  name: external_exports.string().optional(),
  unread_count: external_exports.number().optional(),
  last_message: external_exports.string().optional(),
  updated_at: external_exports.number()
});
var SyncQueries = class {
  constructor(db2) {
    this.db = db2;
  }
  resolveUserAliases(currentUser) {
    const primaryUser = currentUser?.trim() || DEFAULT_CURRENT_USER;
    const fallbackUser = DEFAULT_CURRENT_USER;
    return [primaryUser, fallbackUser];
  }
  getMessageReactions(messageIds, currentUser) {
    if (messageIds.length === 0) {
      return {};
    }
    const placeholders = messageIds.map(() => "?").join(", ");
    const rows = this.db.prepare(`
      SELECT message_id, emoji, COUNT(*) as count,
             SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as reacted_by_current_user
      FROM message_reactions
      WHERE message_id IN (${placeholders})
      GROUP BY message_id, emoji
    `).all(currentUser, ...messageIds);
    return rows.reduce((acc, row) => {
      const existing = acc[row.message_id] ?? [];
      existing.push({
        emoji: row.emoji,
        count: row.count,
        reactedByCurrentUser: row.reacted_by_current_user > 0
      });
      acc[row.message_id] = existing;
      return acc;
    }, {});
  }
  /**
   * Insert or update message with deduplication
   * Returns true if message was inserted, false if duplicate
   */
  async insertMessage(message, currentUser = "You") {
    try {
      const msgMeta = message;
      console.log("[DB] Raw message received:", { id: msgMeta.id, chat_id: msgMeta.chat_id, sender: msgMeta.sender });
      const validated = MessageEventSchema.parse(message);
      console.log("[DB] Message validated successfully:", { id: validated.id, chat_id: validated.chat_id });
      const readAt = validated.read_at !== void 0 ? validated.read_at : validated.is_read ? validated.timestamp : validated.sender === currentUser ? validated.timestamp : null;
      const isEdited = validated.is_edited ? 1 : 0;
      const messageType = validated.type ?? "text";
      const filePath = validated.file_path ?? null;
      const fileName = validated.file_name ?? null;
      const fileSize = validated.file_size ?? null;
      const mimeType = validated.mime_type ?? null;
      const existing = this.db.prepare(
        "SELECT id FROM messages WHERE id = ?"
      ).get(validated.id);
      if (existing) {
        console.log(`[DB] Duplicate message ignored: ${validated.id}`);
        return false;
      }
      console.log("[DB] Inserting new message into database...");
      const insertMessage2 = this.db.prepare(`
        INSERT INTO messages (
          id,
          chat_id,
          sender,
          recipient,
          content,
          timestamp,
          read_at,
          is_edited,
          type,
          file_path,
          file_name,
          file_size,
          mime_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const selectUnreadCount = this.db.prepare(`
        SELECT COUNT(*) as count FROM messages
        WHERE chat_id = ? AND recipient = ? AND read_at IS NULL
      `);
      const updateChat = this.db.prepare(`
        UPDATE chats 
        SET last_message = ?, updated_at = ?, unread_count = ?
        WHERE id = ?
      `);
      const chatPreview = validated.content?.trim() || (messageType === "image" ? `\u{1F4F7} ${fileName ?? "Image"}` : messageType === "file" ? `\u{1F4CE} ${fileName ?? "Attachment"}` : "");
      const transaction = this.db.transaction(() => {
        console.log("[DB] Executing message insert...");
        insertMessage2.run(
          validated.id,
          validated.chat_id,
          validated.sender,
          validated.recipient,
          validated.content,
          validated.timestamp,
          readAt,
          isEdited,
          messageType,
          filePath,
          fileName,
          fileSize,
          mimeType
        );
        console.log("[DB] Executing chat update...");
        const unreadCount = selectUnreadCount.get(validated.chat_id, currentUser);
        updateChat.run(
          chatPreview,
          validated.timestamp,
          unreadCount.count,
          validated.chat_id
        );
        console.log("[DB] Transaction completed successfully");
      });
      transaction();
      console.log(`[DB] Message inserted successfully: ${validated.id}`);
      return true;
    } catch (error) {
      console.error("[DB] Failed to insert message:", error);
      throw error;
    }
  }
  /**
   * Upsert chat with latest data
   * Returns true if chat was updated/inserted
   */
  async upsertChat(chatUpdate) {
    try {
      const validated = ChatUpdateEventSchema.parse(chatUpdate);
      const existing = this.db.prepare(
        "SELECT id FROM chats WHERE id = ?"
      ).get(validated.chat_id);
      if (existing) {
        const updateFields = [];
        const values = [];
        if (validated.name !== void 0) {
          updateFields.push("name = ?");
          values.push(validated.name);
        }
        if (validated.unread_count !== void 0) {
          updateFields.push("unread_count = ?");
          values.push(validated.unread_count);
        }
        if (validated.last_message !== void 0) {
          updateFields.push("last_message = ?");
          values.push(validated.last_message);
        }
        if (validated.updated_at !== void 0) {
          updateFields.push("updated_at = ?");
          values.push(validated.updated_at);
        }
        if (updateFields.length > 0) {
          values.push(validated.chat_id);
          const query = `UPDATE chats SET ${updateFields.join(", ")} WHERE id = ?`;
          this.db.prepare(query).run(...values);
          console.log(`[DB] Chat updated: ${validated.chat_id}`);
          return true;
        }
      } else {
        this.db.prepare(`
          INSERT INTO chats (id, name, last_message, updated_at, unread_count)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          validated.chat_id,
          validated.name || "Unknown Chat",
          validated.last_message || "",
          validated.updated_at,
          validated.unread_count || 0
        );
        console.log(`[DB] Chat inserted: ${validated.chat_id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[DB] Failed to upsert chat:", error);
      throw error;
    }
  }
  /**
   * Get messages for a chat with pagination (for current user)
   */
  async getMessagesForChat(chatId, limit = 50, offset = 0, currentUser = "You") {
    try {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE chat_id = ?
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `).all(chatId, limit, offset);
      const messageIds = messages.map((msg) => msg.id);
      const reactions = this.getMessageReactions(messageIds, currentUser);
      return messages.map((message) => ({
        ...message,
        reactions: reactions[message.id] ?? []
      }));
    } catch (error) {
      console.error("[DB] Failed to get messages:", error);
      throw error;
    }
  }
  /**
   * Check if FTS5 is available for fast search
   */
  isFTS5Available() {
    try {
      const result = this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='messages_fts'
      `).get();
      return !!result;
    } catch {
      return false;
    }
  }
  /**
   * Search messages using FTS5 (fast full-text search)
   * Falls back to LIKE queries if FTS5 is not available
   */
  async searchMessages(query, currentUser = "You", limit = 50, offset = 0) {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery)
        return [];
      let messages;
      if (this.isFTS5Available()) {
        const ftsQuery = trimmedQuery.replace(/['"]/g, '""').split(/\s+/).filter((word) => word.length > 0).map((word) => `"${word}"*`).join(" OR ");
        messages = this.db.prepare(`
          SELECT m.*, c.name as chat_name, 
                 bm25(messages_fts) as rank
          FROM messages_fts fts
          INNER JOIN messages m ON fts.id = m.id
          INNER JOIN chats c ON m.chat_id = c.id
          WHERE messages_fts MATCH ?
          ORDER BY rank, m.timestamp DESC
          LIMIT ? OFFSET ?
        `).all(ftsQuery, limit, offset);
        console.log(`[DB] FTS5 search for "${trimmedQuery}" found ${messages.length} results`);
      } else {
        const searchPattern = `%${trimmedQuery.toLowerCase()}%`;
        messages = this.db.prepare(`
          SELECT m.*, c.name as chat_name
          FROM messages m
          INNER JOIN chats c ON m.chat_id = c.id
          WHERE (
            LOWER(m.content) LIKE ?
            OR LOWER(COALESCE(m.file_name, '')) LIKE ?
          )
          ORDER BY m.timestamp DESC
          LIMIT ? OFFSET ?
        `).all(searchPattern, searchPattern, limit, offset);
        console.log(`[DB] LIKE search for "${trimmedQuery}" found ${messages.length} results`);
      }
      const messageIds = messages.map((msg) => msg.id);
      const reactions = this.getMessageReactions(messageIds, currentUser);
      return messages.map((message) => ({
        ...message,
        reactions: reactions[message.id] ?? []
      }));
    } catch (error) {
      console.error("[DB] Failed to search messages:", error);
      throw error;
    }
  }
  /**
   * Search messages within a specific chat using FTS5
   */
  async searchMessagesInChat(chatId, query, currentUser = "You", limit = 50, offset = 0) {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery)
        return [];
      let messages;
      if (this.isFTS5Available()) {
        const ftsQuery = trimmedQuery.replace(/['"]/g, '""').split(/\s+/).filter((word) => word.length > 0).map((word) => `"${word}"*`).join(" OR ");
        messages = this.db.prepare(`
          SELECT m.*, c.name as chat_name,
                 bm25(messages_fts) as rank
          FROM messages_fts fts
          INNER JOIN messages m ON fts.id = m.id
          INNER JOIN chats c ON m.chat_id = c.id
          WHERE messages_fts MATCH ? AND fts.chat_id = ?
          ORDER BY rank, m.timestamp DESC
          LIMIT ? OFFSET ?
        `).all(ftsQuery, chatId, limit, offset);
      } else {
        const searchPattern = `%${trimmedQuery.toLowerCase()}%`;
        messages = this.db.prepare(`
          SELECT m.*, c.name as chat_name
          FROM messages m
          INNER JOIN chats c ON m.chat_id = c.id
          WHERE m.chat_id = ? AND (
            LOWER(m.content) LIKE ?
            OR LOWER(COALESCE(m.file_name, '')) LIKE ?
          )
          ORDER BY m.timestamp DESC
          LIMIT ? OFFSET ?
        `).all(chatId, searchPattern, searchPattern, limit, offset);
      }
      const messageIds = messages.map((msg) => msg.id);
      const reactions = this.getMessageReactions(messageIds, currentUser);
      return messages.map((message) => ({
        ...message,
        reactions: reactions[message.id] ?? []
      }));
    } catch (error) {
      console.error("[DB] Failed to search messages in chat:", error);
      throw error;
    }
  }
  /**
   * Search chats by name or last message (case-insensitive)
   */
  async searchChats(query, limit = 50, offset = 0) {
    try {
      const trimmed = query.trim();
      if (!trimmed) {
        const chats2 = this.db.prepare(`
          SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
          FROM chats
          ORDER BY updated_at DESC
          LIMIT ? OFFSET ?
        `).all(limit, offset);
        const total = this.db.prepare("SELECT COUNT(*) as count FROM chats").get();
        return { chats: chats2, total: total.count };
      }
      const searchPattern = `%${trimmed.toLowerCase()}%`;
      const totalResult = this.db.prepare(`
        SELECT COUNT(*) as count
        FROM chats
        WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(last_message, '')) LIKE ?
      `).get(searchPattern, searchPattern);
      const chats = this.db.prepare(`
        SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
        FROM chats
        WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(last_message, '')) LIKE ?
        ORDER BY updated_at DESC
        LIMIT ? OFFSET ?
      `).all(searchPattern, searchPattern, limit, offset);
      return { chats, total: totalResult.count };
    } catch (error) {
      console.error("[DB] Failed to search chats:", error);
      throw error;
    }
  }
  /**
   * Toggle emoji reaction for a message and return updated reactions
   */
  async toggleReaction(messageId, userId, emoji) {
    try {
      const existing = this.db.prepare(`
        SELECT id FROM message_reactions
        WHERE message_id = ? AND user_id = ? AND emoji = ?
      `).get(messageId, userId, emoji);
      if (existing) {
        this.db.prepare(`
          DELETE FROM message_reactions
          WHERE id = ?
        `).run(existing.id);
      } else {
        this.db.prepare(`
          INSERT INTO message_reactions (id, message_id, user_id, emoji, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(`mr_${messageId}_${userId}_${Date.now()}`, messageId, userId, emoji, Date.now());
      }
      const reactions = this.db.prepare(`
        SELECT emoji, COUNT(*) as count,
               SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as reacted_by_current_user
        FROM message_reactions
        WHERE message_id = ?
        GROUP BY emoji
      `).all(userId, messageId);
      return reactions.map((reaction) => ({
        emoji: reaction.emoji,
        count: reaction.count,
        reactedByCurrentUser: reaction.reacted_by_current_user > 0
      }));
    } catch (error) {
      console.error("[DB] Failed to toggle reaction:", error);
      throw error;
    }
  }
  /**
   * Get all messages for a chat (for sync purposes)
   */
  async getAllMessagesForChat(chatId, limit = 50, offset = 0) {
    try {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `).all(chatId, limit, offset);
      return messages;
    } catch (error) {
      console.error("[DB] Failed to get messages:", error);
      throw error;
    }
  }
  /**
   * Get all chats ordered by updated_at DESC
   */
  async getAllChats() {
    try {
      const chats = this.db.prepare(`
        SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
        FROM chats 
        ORDER BY updated_at DESC
      `).all();
      return chats;
    } catch (error) {
      console.error("[DB] Failed to get chats:", error);
      throw error;
    }
  }
  /**
   * Mark messages as read for a chat
   */
  async markMessagesAsRead(chatId, currentUser = "You") {
    try {
      const readAt = Date.now();
      const [primaryUser, fallbackUser] = this.resolveUserAliases(currentUser);
      const result = this.db.prepare(`
        UPDATE messages 
        SET read_at = ? 
        WHERE chat_id = ? AND recipient IN (?, ?) AND read_at IS NULL
      `).run(readAt, chatId, primaryUser, fallbackUser);
      const unreadCount = this.db.prepare(`
        SELECT COUNT(*) as count FROM messages 
        WHERE chat_id = ? AND recipient IN (?, ?) AND read_at IS NULL
      `).get(chatId, primaryUser, fallbackUser);
      this.db.prepare(`
        UPDATE chats 
        SET unread_count = ? 
        WHERE id = ?
      `).run(unreadCount.count, chatId);
      console.log(`[DB] Marked ${result.changes} messages as read for chat ${chatId}`);
      return result.changes;
    } catch (error) {
      console.error("[DB] Failed to mark messages as read:", error);
      throw error;
    }
  }
  /**
   * Get unread message count for all chats
   */
  async getUnreadCounts(currentUser = "You") {
    try {
      const [primaryUser, fallbackUser] = this.resolveUserAliases(currentUser);
      const unreadCounts = this.db.prepare(`
        SELECT chat_id, COUNT(*) as count
        FROM messages 
        WHERE read_at IS NULL AND recipient IN (?, ?)
        GROUP BY chat_id
      `).all(primaryUser, fallbackUser);
      const result = {};
      unreadCounts.forEach((row) => {
        result[row.chat_id] = row.count;
      });
      return result;
    } catch (error) {
      console.error("[DB] Failed to get unread counts:", error);
      throw error;
    }
  }
  /**
   * Delete message by ID
   */
  async deleteMessage(messageId) {
    try {
      const message = this.db.prepare(`
        SELECT chat_id FROM messages WHERE id = ?
      `).get(messageId);
      if (!message) {
        return { success: false };
      }
      const result = this.db.prepare(`
        DELETE FROM messages WHERE id = ?
      `).run(messageId);
      if (result.changes > 0) {
        const latestMessage = this.db.prepare(`
          SELECT content, type, file_name, timestamp
          FROM messages
          WHERE chat_id = ?
          ORDER BY timestamp DESC
          LIMIT 1
        `).get(message.chat_id);
        const lastMessage = latestMessage ? latestMessage.content?.trim() || (latestMessage.type === "image" ? `\u{1F4F7} ${latestMessage.file_name ?? "Image"}` : latestMessage.type === "file" ? `\u{1F4CE} ${latestMessage.file_name ?? "Attachment"}` : "") : "";
        const updatedAt = latestMessage ? latestMessage.timestamp : Date.now();
        this.db.prepare(`
          UPDATE chats
          SET last_message = ?, updated_at = ?
          WHERE id = ?
        `).run(lastMessage, updatedAt, message.chat_id);
      }
      return { success: result.changes > 0, chatId: message.chat_id };
    } catch (error) {
      console.error("[DB] Failed to delete message:", error);
      throw error;
    }
  }
  /**
   * Update message content
   */
  async updateMessage(messageId, content) {
    try {
      const message = this.db.prepare(`
        SELECT chat_id FROM messages WHERE id = ?
      `).get(messageId);
      if (!message) {
        return { success: false };
      }
      const result = this.db.prepare(`
        UPDATE messages 
        SET content = ?, is_edited = 1 
        WHERE id = ?
      `).run(content, messageId);
      if (result.changes > 0) {
        this.db.prepare(`
          UPDATE chats 
          SET last_message = ?, updated_at = ?
          WHERE id = ?
        `).run(content, Date.now(), message.chat_id);
      }
      return { success: result.changes > 0, chatId: message.chat_id };
    } catch (error) {
      console.error("[DB] Failed to update message:", error);
      throw error;
    }
  }
  /**
   * Delete chat and all its messages
   */
  async deleteChat(chatId) {
    try {
      this.db.prepare(`
        DELETE FROM messages WHERE chat_id = ?
      `).run(chatId);
      this.db.prepare(`
        DELETE FROM message_reactions WHERE message_id IN (
          SELECT id FROM messages WHERE chat_id = ?
        )
      `).run(chatId);
      const result = this.db.prepare(`
        DELETE FROM chats WHERE id = ?
      `).run(chatId);
      console.log(`[DB] Deleted chat ${chatId}: ${result.changes > 0 ? "success" : "not found"}`);
      return { success: result.changes > 0 };
    } catch (error) {
      console.error("[DB] Failed to delete chat:", error);
      throw error;
    }
  }
  /**
   * Seed database with large dataset for testing performance
   * Creates 200 chats with 20,000+ messages distributed across them
   */
  async seedLargeDataset() {
    console.log("[DB] Starting large dataset seed...");
    const CHAT_COUNT = 200;
    const MESSAGE_COUNT = 2e4;
    const currentUser = "You";
    const firstNames = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack"];
    const lastNames = ["Johnson", "Smith", "Williams", "Brown", "Jones", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
    const messageTemplates = [
      "Hey, how are you?",
      "Did you see the latest update?",
      "Let me know when you're free",
      "Great work on the project!",
      "Can we schedule a meeting?",
      "Thanks for your help!",
      "I'll get back to you soon",
      "That sounds good to me",
      "Let's discuss this tomorrow",
      "I have a question about the proposal",
      "The deadline is approaching",
      "Please review the document",
      "I've updated the spreadsheet",
      "Can you send me the file?",
      "I'm working on it now",
      "Let's sync up later today",
      "Great progress so far!",
      "I need more information",
      "When is the next meeting?",
      "I'll send the report by EOD"
    ];
    try {
      const insertChat = this.db.prepare(`
        INSERT OR REPLACE INTO chats (id, name, last_message, updated_at, unread_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      const insertMessage2 = this.db.prepare(`
        INSERT OR REPLACE INTO messages (id, chat_id, sender, recipient, content, timestamp, read_at, is_edited, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'text')
      `);
      const startTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1e3;
      const thirtyDaysAgo = startTime - 30 * oneDay;
      const chats = [];
      this.db.exec("BEGIN TRANSACTION");
      for (let i = 1; i <= CHAT_COUNT; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const chatName = i <= 10 ? `${firstName} ${lastName}` : i <= 20 ? `Team ${String.fromCharCode(64 + (i - 10))}` : `Chat ${i}`;
        const chatId = String(i);
        const updatedAt = thirtyDaysAgo + Math.floor(Math.random() * (startTime - thirtyDaysAgo));
        const unreadCount = Math.random() < 0.3 ? Math.floor(Math.random() * 10) : 0;
        insertChat.run(chatId, chatName, "Loading messages...", updatedAt, unreadCount);
        chats.push({ id: chatId, name: chatName });
      }
      console.log(`[DB] Created ${CHAT_COUNT} chats`);
      let messagesCreated = 0;
      for (let i = 0; i < MESSAGE_COUNT; i++) {
        const chatIndex = Math.floor(Math.pow(Math.random(), 1.5) * CHAT_COUNT);
        const chat = chats[chatIndex];
        if (!chat)
          continue;
        const isOutgoing = Math.random() < 0.4;
        const sender = isOutgoing ? currentUser : chat.name;
        const recipient = isOutgoing ? chat.name : currentUser;
        const messageId = `seed_msg_${i}_${Date.now()}`;
        const content = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
        const timestamp = thirtyDaysAgo + Math.floor(Math.random() * (startTime - thirtyDaysAgo));
        const readAt = isOutgoing ? timestamp : Math.random() < 0.8 ? timestamp : null;
        insertMessage2.run(messageId, chat.id, sender, recipient, content, timestamp, readAt);
        messagesCreated++;
        if (messagesCreated % 5e3 === 0) {
          console.log(`[DB] Created ${messagesCreated} messages...`);
        }
      }
      const updateLastMessage = this.db.prepare(`
        UPDATE chats SET 
          last_message = (
            SELECT content FROM messages 
            WHERE chat_id = chats.id 
            ORDER BY timestamp DESC LIMIT 1
          ),
          updated_at = (
            SELECT timestamp FROM messages 
            WHERE chat_id = chats.id 
            ORDER BY timestamp DESC LIMIT 1
          )
        WHERE id = ?
      `);
      for (const chat of chats) {
        updateLastMessage.run(chat.id);
      }
      this.db.exec("COMMIT");
      const duration = Date.now() - startTime;
      console.log(`[DB] Seed complete: ${CHAT_COUNT} chats, ${messagesCreated} messages in ${duration}ms`);
      return { chats: CHAT_COUNT, messages: messagesCreated };
    } catch (error) {
      this.db.exec("ROLLBACK");
      console.error("[DB] Failed to seed dataset:", error);
      throw error;
    }
  }
  /**
   * Clear all data (for testing)
   */
  async clearAllData() {
    try {
      this.db.exec("BEGIN TRANSACTION");
      this.db.exec("DELETE FROM messages");
      this.db.exec("DELETE FROM chats");
      this.db.exec("DELETE FROM message_reactions");
      this.db.exec("DELETE FROM offline_queue");
      this.db.exec("COMMIT");
      console.log("[DB] All data cleared");
    } catch (error) {
      this.db.exec("ROLLBACK");
      console.error("[DB] Failed to clear data:", error);
      throw error;
    }
  }
  // ============================================================
  // OFFLINE QUEUE OPERATIONS
  // ============================================================
  /**
   * Add an item to the offline queue for later sync
   */
  async addToOfflineQueue(type, payload) {
    try {
      const id = `queue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      this.db.prepare(`
        INSERT INTO offline_queue (id, type, payload, created_at, status)
        VALUES (?, ?, ?, ?, 'pending')
      `).run(id, type, JSON.stringify(payload), Date.now());
      console.log(`[DB] Added to offline queue: ${type} (${id})`);
      return id;
    } catch (error) {
      console.error("[DB] Failed to add to offline queue:", error);
      throw error;
    }
  }
  /**
   * Get all pending items from the offline queue
   */
  async getPendingQueueItems(limit = 100) {
    try {
      const items = this.db.prepare(`
        SELECT id, type, payload, created_at, retry_count, last_error
        FROM offline_queue
        WHERE status = 'pending'
        ORDER BY created_at ASC
        LIMIT ?
      `).all(limit);
      return items.map((item) => ({
        ...item,
        payload: JSON.parse(item.payload)
      }));
    } catch (error) {
      console.error("[DB] Failed to get pending queue items:", error);
      throw error;
    }
  }
  /**
   * Mark a queue item as completed (synced successfully)
   */
  async markQueueItemCompleted(id) {
    try {
      this.db.prepare(`
        UPDATE offline_queue
        SET status = 'completed'
        WHERE id = ?
      `).run(id);
      console.log(`[DB] Queue item completed: ${id}`);
    } catch (error) {
      console.error("[DB] Failed to mark queue item as completed:", error);
      throw error;
    }
  }
  /**
   * Mark a queue item as failed with error
   */
  async markQueueItemFailed(id, error) {
    try {
      this.db.prepare(`
        UPDATE offline_queue
        SET status = 'pending',
            retry_count = retry_count + 1,
            last_error = ?
        WHERE id = ?
      `).run(error, id);
      console.log(`[DB] Queue item failed: ${id} - ${error}`);
    } catch (error2) {
      console.error("[DB] Failed to mark queue item as failed:", error2);
      throw error2;
    }
  }
  /**
   * Remove completed and old failed items from queue
   */
  async cleanupOfflineQueue(maxAge = 7 * 24 * 60 * 60 * 1e3) {
    try {
      const cutoff = Date.now() - maxAge;
      const result = this.db.prepare(`
        DELETE FROM offline_queue
        WHERE status = 'completed'
           OR (status = 'failed' AND created_at < ?)
           OR retry_count > 10
      `).run(cutoff);
      console.log(`[DB] Cleaned up ${result.changes} queue items`);
      return result.changes;
    } catch (error) {
      console.error("[DB] Failed to cleanup offline queue:", error);
      throw error;
    }
  }
  /**
   * Get offline queue statistics
   */
  async getOfflineQueueStats() {
    try {
      const stats = this.db.prepare(`
        SELECT 
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN retry_count > 10 THEN 1 END) as failed,
          COUNT(*) as total
        FROM offline_queue
      `).get();
      return stats;
    } catch (error) {
      console.error("[DB] Failed to get offline queue stats:", error);
      throw error;
    }
  }
};

// electron/db/migrations.ts
var DEFAULT_CURRENT_USER2 = "You";
function ensureMessagesTable(db2) {
  db2.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      read_at INTEGER,
      is_edited INTEGER DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'text',
      file_path TEXT,
      file_name TEXT,
      file_size INTEGER,
      mime_type TEXT,
      deleted_at INTEGER,
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
    );

    -- Primary index for chat message retrieval
    CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp
      ON messages(chat_id, timestamp DESC);
    
    -- Index for sender lookups (used in joins)
    CREATE INDEX IF NOT EXISTS idx_messages_sender
      ON messages(sender);
    
    -- Index for recipient lookups
    CREATE INDEX IF NOT EXISTS idx_messages_recipient
      ON messages(recipient);
    
    -- Index for soft-deleted messages
    CREATE INDEX IF NOT EXISTS idx_messages_deleted_at
      ON messages(deleted_at) WHERE deleted_at IS NOT NULL;
    
    -- Index for message type filtering
    CREATE INDEX IF NOT EXISTS idx_messages_type
      ON messages(type);
  `);
}
function ensureFTS5Table(db2) {
  try {
    const ftsExists = db2.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='messages_fts'
    `).get();
    if (!ftsExists) {
      db2.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
          id UNINDEXED,
          chat_id UNINDEXED,
          sender,
          content,
          file_name,
          content='messages',
          content_rowid='rowid'
        );
      `);
      db2.exec(`
        -- Trigger to insert into FTS when a new message is added
        CREATE TRIGGER IF NOT EXISTS messages_ai AFTER INSERT ON messages BEGIN
          INSERT INTO messages_fts(rowid, id, chat_id, sender, content, file_name)
          VALUES (NEW.rowid, NEW.id, NEW.chat_id, NEW.sender, NEW.content, COALESCE(NEW.file_name, ''));
        END;
        
        -- Trigger to remove from FTS when a message is deleted
        CREATE TRIGGER IF NOT EXISTS messages_ad AFTER DELETE ON messages BEGIN
          INSERT INTO messages_fts(messages_fts, rowid, id, chat_id, sender, content, file_name)
          VALUES ('delete', OLD.rowid, OLD.id, OLD.chat_id, OLD.sender, OLD.content, COALESCE(OLD.file_name, ''));
        END;
        
        -- Trigger to update FTS when a message is updated
        CREATE TRIGGER IF NOT EXISTS messages_au AFTER UPDATE ON messages BEGIN
          INSERT INTO messages_fts(messages_fts, rowid, id, chat_id, sender, content, file_name)
          VALUES ('delete', OLD.rowid, OLD.id, OLD.chat_id, OLD.sender, OLD.content, COALESCE(OLD.file_name, ''));
          INSERT INTO messages_fts(rowid, id, chat_id, sender, content, file_name)
          VALUES (NEW.rowid, NEW.id, NEW.chat_id, NEW.sender, NEW.content, COALESCE(NEW.file_name, ''));
        END;
      `);
      db2.exec(`
        INSERT INTO messages_fts(rowid, id, chat_id, sender, content, file_name)
        SELECT rowid, id, chat_id, sender, content, COALESCE(file_name, '')
        FROM messages;
      `);
      console.log("[DB] FTS5 table created and populated");
    }
  } catch (error) {
    console.error("[DB] Failed to create FTS5 table:", error);
  }
}
function ensureMessageReactionsTable(db2) {
  db2.exec(`
    CREATE TABLE IF NOT EXISTS message_reactions (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
      UNIQUE(message_id, user_id, emoji)
    );

    CREATE INDEX IF NOT EXISTS idx_message_reactions_message
      ON message_reactions(message_id, emoji);
  `);
}
function getMessagesColumns(db2) {
  return db2.prepare("PRAGMA table_info(messages)").all();
}
function getChatNamesById(db2) {
  const rows = db2.prepare("SELECT id, name FROM chats").all();
  return new Map(rows.map((row) => [row.id, row.name]));
}
function migrateMessagesSchema(db2, currentUser = DEFAULT_CURRENT_USER2) {
  const columns = getMessagesColumns(db2);
  if (columns.length === 0) {
    ensureMessagesTable(db2);
    ensureMessageReactionsTable(db2);
    return;
  }
  const columnNames = new Set(columns.map((column) => column.name));
  const needsMigration = !columnNames.has("recipient") || !columnNames.has("read_at") || !columnNames.has("type") || !columnNames.has("file_path") || !columnNames.has("file_name") || !columnNames.has("file_size") || !columnNames.has("mime_type");
  if (!needsMigration) {
    ensureMessageReactionsTable(db2);
    return;
  }
  const chatNamesById = getChatNamesById(db2);
  const migrate = db2.transaction(() => {
    db2.exec(`
      CREATE TABLE messages_new (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        recipient TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        read_at INTEGER,
        is_edited INTEGER DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'text',
        file_path TEXT,
        file_name TEXT,
        file_size INTEGER,
        mime_type TEXT,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);
    const rows = db2.prepare("SELECT * FROM messages").all();
    const insert = db2.prepare(`
      INSERT INTO messages_new (
        id,
        chat_id,
        sender,
        recipient,
        content,
        timestamp,
        read_at,
        is_edited,
        type,
        file_path,
        file_name,
        file_size,
        mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    rows.forEach((row) => {
      const sender = row.sender ?? row.sender_id ?? "Unknown";
      const inferredRecipient = sender === currentUser ? chatNamesById.get(row.chat_id) || "Unknown" : currentUser;
      const recipient = row.recipient ?? inferredRecipient;
      const readAt = row.read_at ?? (row.is_read ? row.timestamp : null);
      const isEdited = typeof row.is_edited === "number" ? row.is_edited : 0;
      const type = row.type ?? "text";
      insert.run(
        row.id,
        row.chat_id,
        sender,
        recipient,
        row.content,
        row.timestamp,
        readAt,
        isEdited,
        type,
        row.file_path ?? null,
        row.file_name ?? null,
        row.file_size ?? null,
        row.mime_type ?? null
      );
    });
    db2.exec("DROP TABLE messages");
    db2.exec("ALTER TABLE messages_new RENAME TO messages");
    db2.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp
        ON messages(chat_id, timestamp DESC);
    `);
  });
  migrate();
  ensureMessageReactionsTable(db2);
}
function ensureOfflineQueueTable(db2) {
  db2.exec(`
    CREATE TABLE IF NOT EXISTS offline_queue (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      retry_count INTEGER DEFAULT 0,
      last_error TEXT,
      status TEXT NOT NULL DEFAULT 'pending'
    );
    
    CREATE INDEX IF NOT EXISTS idx_offline_queue_status
      ON offline_queue(status, created_at);
  `);
}
function ensureChatParticipantsTable(db2) {
  db2.exec(`
    CREATE TABLE IF NOT EXISTS chat_participants (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(chat_id, user_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_chat_participants_chat
      ON chat_participants(chat_id);
    
    CREATE INDEX IF NOT EXISTS idx_chat_participants_user
      ON chat_participants(user_id);
  `);
}
function ensureMessageSchema(db2, currentUser = DEFAULT_CURRENT_USER2) {
  ensureMessagesTable(db2);
  migrateMessagesSchema(db2, currentUser);
  ensureMessageReactionsTable(db2);
  ensureFTS5Table(db2);
  ensureOfflineQueueTable(db2);
  ensureChatParticipantsTable(db2);
}

// electron/ipc/events.ts
var import_electron5 = require("electron");
var import_node_path2 = __toESM(require("node:path"));
var import_node_fs = __toESM(require("node:fs"));
var IPC_EVENTS = {
  // Connection status events
  CONNECTION_STATUS: "sync:connection-status",
  CONNECTION_CONNECTED: "sync:connection-connected",
  CONNECTION_DISCONNECTED: "sync:connection-disconnected",
  // Message events
  MESSAGE_INSERTED: "sync:message-inserted",
  MESSAGE_UPDATED: "sync:message-updated",
  MESSAGE_DELETED: "sync:message-deleted",
  MESSAGE_REACTIONS_UPDATED: "sync:message-reactions-updated",
  ATTACHMENT_UPLOAD_PROGRESS: "sync:attachment-upload-progress",
  // Chat events
  CHAT_UPDATED: "sync:chat-updated",
  CHAT_LIST_UPDATED: "sync:chat-list-updated",
  // Request/response channels (for renderer to main)
  GET_CONNECTION_STATUS: "sync:get-connection-status",
  GET_MESSAGES: "sync:get-messages",
  GET_CHATS: "sync:get-chats",
  MARK_MESSAGES_READ: "sync:mark-messages-read",
  SEND_MESSAGE: "sync:send-message",
  UPDATE_MESSAGE: "sync:update-message",
  DELETE_MESSAGE: "sync:delete-message",
  DELETE_CHAT: "sync:delete-chat",
  SEARCH_MESSAGES: "sync:search-messages",
  SEARCH_CHATS: "sync:search-chats",
  TOGGLE_REACTION: "sync:toggle-reaction",
  SELECT_ATTACHMENT: "sync:select-attachment",
  SIMULATE_DISCONNECT: "sync:simulate-disconnect",
  FORCE_RECONNECT: "sync:force-reconnect",
  SEED_LARGE_DATASET: "sync:seed-large-dataset",
  CLEAR_ALL_DATA: "sync:clear-all-data"
};
var MessageInsertedPayloadSchema = external_exports.object({
  id: external_exports.string(),
  chat_id: external_exports.string(),
  sender: external_exports.string(),
  recipient: external_exports.string(),
  content: external_exports.string(),
  timestamp: external_exports.number(),
  read_at: external_exports.number().nullable().optional(),
  is_read: external_exports.boolean().optional(),
  is_edited: external_exports.boolean().optional(),
  type: external_exports.enum(["text", "image", "file"]).optional(),
  file_path: external_exports.string().nullable().optional(),
  file_name: external_exports.string().nullable().optional(),
  file_size: external_exports.number().nullable().optional(),
  mime_type: external_exports.string().nullable().optional(),
  reactions: external_exports.array(external_exports.object({
    emoji: external_exports.string(),
    count: external_exports.number(),
    reactedByCurrentUser: external_exports.boolean()
  })).optional()
});
var MessageReactionsUpdatedSchema = external_exports.object({
  messageId: external_exports.string(),
  reactions: external_exports.array(external_exports.object({
    emoji: external_exports.string(),
    count: external_exports.number(),
    reactedByCurrentUser: external_exports.boolean()
  }))
});
var AttachmentUploadProgressSchema = external_exports.object({
  messageId: external_exports.string(),
  progress: external_exports.number().min(0).max(100)
});
var SendMessageSchema = external_exports.object({
  chatId: external_exports.string(),
  content: external_exports.string().optional(),
  sender: external_exports.string(),
  recipient: external_exports.string(),
  attachment: external_exports.object({
    filePath: external_exports.string(),
    fileName: external_exports.string(),
    fileSize: external_exports.number(),
    mimeType: external_exports.string(),
    type: external_exports.enum(["image", "file"])
  }).optional()
});
var UpdateMessageSchema = external_exports.object({
  messageId: external_exports.string(),
  content: external_exports.string().min(1)
});
var DeleteMessageSchema = external_exports.object({
  messageId: external_exports.string()
});
var DeleteChatSchema = external_exports.object({
  chatId: external_exports.string()
});
var SearchMessagesSchema = external_exports.object({
  query: external_exports.string(),
  currentUser: external_exports.string().optional(),
  limit: external_exports.number().int().min(1).max(200).optional(),
  offset: external_exports.number().int().min(0).optional()
});
var SearchChatsSchema2 = external_exports.object({
  query: external_exports.string(),
  limit: external_exports.number().int().min(1).max(200).optional(),
  offset: external_exports.number().int().min(0).optional()
});
var ToggleReactionSchema = external_exports.object({
  messageId: external_exports.string(),
  userId: external_exports.string(),
  emoji: external_exports.string().min(1)
});
var SelectAttachmentSchema = external_exports.object({
  currentUser: external_exports.string().optional()
});
var MIME_TYPE_OVERRIDES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf"
};
var DEFAULT_CURRENT_USER3 = "You";
var INVALID_PATH_SEGMENT = /[<>:"/\\|?*\x00-\x1F]/g;
function inferMimeType(filePath) {
  const extension = import_node_path2.default.extname(filePath).toLowerCase();
  return MIME_TYPE_OVERRIDES[extension] ?? "application/octet-stream";
}
function inferAttachmentType(mimeType) {
  return mimeType.startsWith("image/") ? "image" : "file";
}
function sanitizePathSegment(value, fallback) {
  const sanitized = value.replace(INVALID_PATH_SEGMENT, "_").trim();
  return sanitized.length > 0 ? sanitized : fallback;
}
function resolveUploadsBasePath() {
  return import_electron5.app.isPackaged ? import_electron5.app.getPath("userData") : import_electron5.app.getAppPath();
}
var ChatUpdatedPayloadSchema = external_exports.object({
  id: external_exports.string(),
  name: external_exports.string(),
  last_message: external_exports.string().optional(),
  updated_at: external_exports.number(),
  unread_count: external_exports.number()
});
var ConnectionStatusPayloadSchema = external_exports.object({
  status: external_exports.enum(["connected", "reconnecting", "offline"]),
  lastConnected: external_exports.number().optional(),
  reconnectAttempts: external_exports.number().optional()
});
var SyncIPCEmitter = class {
  /**
   * Emit message inserted event to all renderer windows
   */
  static emitMessageInserted(message) {
    try {
      const validated = MessageInsertedPayloadSchema.parse(message);
      import_electron5.webContents.getAllWebContents().forEach((contents) => {
        contents.send(IPC_EVENTS.MESSAGE_INSERTED, validated);
      });
      console.log(`[IPC] Message inserted event sent: ${validated.id}`);
    } catch (error) {
      console.error("[IPC] Failed to emit message inserted:", error);
    }
  }
  /**
   * Emit message reactions updated event
   */
  static emitMessageReactionsUpdated(payload) {
    try {
      const validated = MessageReactionsUpdatedSchema.parse(payload);
      import_electron5.webContents.getAllWebContents().forEach((contents) => {
        contents.send(IPC_EVENTS.MESSAGE_REACTIONS_UPDATED, validated);
      });
      console.log(`[IPC] Message reactions updated event sent: ${validated.messageId}`);
    } catch (error) {
      console.error("[IPC] Failed to emit message reactions updated:", error);
    }
  }
  /**
   * Emit attachment upload progress
   */
  static emitAttachmentUploadProgress(payload) {
    try {
      const validated = AttachmentUploadProgressSchema.parse(payload);
      import_electron5.webContents.getAllWebContents().forEach((contents) => {
        contents.send(IPC_EVENTS.ATTACHMENT_UPLOAD_PROGRESS, validated);
      });
    } catch (error) {
      console.error("[IPC] Failed to emit attachment upload progress:", error);
    }
  }
  /**
   * Emit chat updated event to all renderer windows
   */
  static emitChatUpdated(chat) {
    try {
      const validated = ChatUpdatedPayloadSchema.parse(chat);
      import_electron5.webContents.getAllWebContents().forEach((contents) => {
        contents.send(IPC_EVENTS.CHAT_UPDATED, validated);
      });
      console.log(`[IPC] Chat updated event sent: ${validated.id}`);
    } catch (error) {
      console.error("[IPC] Failed to emit chat updated:", error);
    }
  }
  /**
   * Emit connection status change to all renderer windows
   */
  static emitConnectionStatus(status) {
    try {
      const validated = ConnectionStatusPayloadSchema.parse(status);
      import_electron5.webContents.getAllWebContents().forEach((contents) => {
        contents.send(IPC_EVENTS.CONNECTION_STATUS, validated);
      });
      console.log(`[IPC] Connection status event sent: ${validated.status}`);
    } catch (error) {
      console.error("[IPC] Failed to emit connection status:", error);
    }
  }
  /**
   * Emit connection established event
   */
  static emitConnectionConnected() {
    import_electron5.webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_EVENTS.CONNECTION_CONNECTED);
    });
    console.log("[IPC] Connection connected event sent");
  }
  /**
   * Emit connection lost event
   */
  static emitConnectionDisconnected() {
    import_electron5.webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_EVENTS.CONNECTION_DISCONNECTED);
    });
    console.log("[IPC] Connection disconnected event sent");
  }
  /**
   * Emit chat list updated event (when multiple chats change)
   */
  static emitChatListUpdated() {
    import_electron5.webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_EVENTS.CHAT_LIST_UPDATED);
    });
    console.log("[IPC] Chat list updated event sent");
  }
  /**
   * Emit message updated event
   */
  static emitMessageUpdated(messageId, content) {
    const payload = { messageId, content };
    import_electron5.webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_EVENTS.MESSAGE_UPDATED, payload);
    });
    console.log(`[IPC] Message updated event sent: ${messageId}`);
  }
  /**
   * Emit message deleted event
   */
  static emitMessageDeleted(messageId) {
    const payload = { messageId };
    import_electron5.webContents.getAllWebContents().forEach((contents) => {
      contents.send(IPC_EVENTS.MESSAGE_DELETED, { messageId });
    });
    console.log(`[IPC] Message deleted event sent: ${messageId}`);
  }
  /**
   * Show desktop notification for new message
   */
  static showDesktopNotification(message, chatName, currentUser = DEFAULT_CURRENT_USER3) {
    try {
      const validated = MessageInsertedPayloadSchema.parse(message);
      const previewText = validated.content?.trim() || (validated.type === "image" ? `\u{1F4F7} ${validated.file_name ?? "Image"}` : validated.type === "file" ? `\u{1F4CE} ${validated.file_name ?? "Attachment"}` : "");
      if (validated.recipient === currentUser && validated.sender !== currentUser) {
        const notification = new import_electron5.Notification({
          title: validated.sender,
          body: previewText,
          subtitle: chatName,
          silent: false
        });
        notification.on("click", () => {
          const windows = import_electron5.BrowserWindow.getAllWindows();
          if (windows.length > 0) {
            const mainWindow = windows[0];
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              if (mainWindow.webContents) {
                mainWindow.webContents.send("sync:open-chat", validated.chat_id);
              }
            }
          }
        });
        notification.show();
        console.log(`[Notification] Desktop notification sent for message: ${validated.id}`);
      }
    } catch (error) {
      console.error("[Notification] Failed to show desktop notification:", error);
    }
  }
};
function registerSyncIPCHandlers(syncQueries2) {
  console.log("[IPC] Starting registration of sync IPC handlers...");
  if (!syncQueries2) {
    console.error("[IPC] syncQueries parameter is null/undefined");
    return;
  }
  console.log("[IPC] syncQueries parameter is valid, registering handlers...");
  import_electron5.ipcMain.handle(IPC_EVENTS.GET_MESSAGES, async (event, { chatId, limit, offset, currentUser }) => {
    console.log("[IPC] GET_MESSAGES handler called for chatId:", chatId);
    try {
      if (!chatId) {
        throw new Error("chatId is required");
      }
      const messages = await syncQueries2.getMessagesForChat(
        chatId,
        limit || 50,
        offset || 0,
        currentUser
      );
      console.log("[IPC] GET_MESSAGES retrieved", messages.length, "messages");
      return { success: true, data: messages };
    } catch (error) {
      console.error("[IPC] Get messages failed:", error);
      return { success: false, error: "Failed to get messages" };
    }
  });
  console.log("[IPC] GET_MESSAGES handler registered");
  import_electron5.ipcMain.handle(IPC_EVENTS.GET_CHATS, async () => {
    try {
      const chats = await syncQueries2.getAllChats();
      return { success: true, data: chats };
    } catch (error) {
      console.error("[IPC] Get chats failed:", error);
      return { success: false, error: "Failed to get chats" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.MARK_MESSAGES_READ, async (event, { chatId, currentUser }) => {
    console.log("[IPC] MARK_MESSAGES_READ handler called for chatId:", chatId);
    try {
      if (!chatId) {
        throw new Error("chatId is required");
      }
      const count = await syncQueries2.markMessagesAsRead(chatId, currentUser);
      console.log("[IPC] MARK_MESSAGES_READ marked", count, "messages as read");
      const chats = await syncQueries2.getAllChats();
      const updatedChat = chats.find((c) => c.id === chatId);
      if (updatedChat) {
        SyncIPCEmitter.emitChatUpdated(updatedChat);
      }
      return { success: true, data: { markedCount: count } };
    } catch (error) {
      console.error("[IPC] Mark messages read failed:", error);
      return { success: false, error: "Failed to mark messages as read" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.SEND_MESSAGE, async (event, rawPayload) => {
    try {
      const parsed = SendMessageSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid send message payload");
      }
      const { chatId, content, sender, recipient, attachment } = parsed.data;
      if (!content?.trim() && !attachment) {
        throw new Error("Message content or attachment is required");
      }
      const timestamp = Date.now();
      const messageType = attachment?.type ?? "text";
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chat_id: chatId,
        sender,
        recipient,
        content: content ?? "",
        timestamp,
        read_at: timestamp,
        is_edited: false,
        type: messageType,
        file_path: attachment?.filePath ?? null,
        file_name: attachment?.fileName ?? null,
        file_size: attachment?.fileSize ?? null,
        mime_type: attachment?.mimeType ?? null
      };
      console.log("[IPC] Attempting to insert message:", { id: message.id, chat_id: message.chat_id, sender: message.sender, type: message.type });
      if (attachment) {
        SyncIPCEmitter.emitAttachmentUploadProgress({ messageId: message.id, progress: 0 });
      }
      const inserted = await syncQueries2.insertMessage(message, sender);
      console.log("[IPC] Message insert result:", inserted ? "success" : "failed");
      if (inserted) {
        SyncIPCEmitter.emitMessageInserted(message);
        if (attachment) {
          SyncIPCEmitter.emitAttachmentUploadProgress({ messageId: message.id, progress: 100 });
        }
        const chats = await syncQueries2.getAllChats();
        const updatedChat = chats.find((c) => c.id === chatId);
        if (updatedChat) {
          SyncIPCEmitter.emitChatUpdated(updatedChat);
        }
        SyncIPCEmitter.emitChatListUpdated();
        console.log("[IPC] Message sent successfully:", message.id);
        return { success: true, data: message };
      } else {
        console.log("[IPC] Message insertion returned false - likely duplicate or validation failed");
        return { success: false, error: "Failed to send message" };
      }
    } catch (error) {
      console.error("[IPC] Send message failed:", error);
      return { success: false, error: "Failed to send message" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.UPDATE_MESSAGE, async (_event, rawPayload) => {
    try {
      const parsed = UpdateMessageSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid update message payload");
      }
      const content = parsed.data.content.trim();
      if (!content) {
        throw new Error("Message content is required");
      }
      const updated = await syncQueries2.updateMessage(parsed.data.messageId, content);
      if (updated.success) {
        SyncIPCEmitter.emitMessageUpdated(parsed.data.messageId, content);
        if (updated.chatId) {
          const chats = await syncQueries2.getAllChats();
          const updatedChat = chats.find((chat) => chat.id === updated.chatId);
          if (updatedChat) {
            SyncIPCEmitter.emitChatUpdated(updatedChat);
          }
        }
        SyncIPCEmitter.emitChatListUpdated();
        return { success: true, data: { messageId: parsed.data.messageId, content } };
      }
      return { success: false, error: "Message not found" };
    } catch (error) {
      console.error("[IPC] Update message failed:", error);
      return { success: false, error: "Failed to update message" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.DELETE_MESSAGE, async (_event, rawPayload) => {
    try {
      const parsed = DeleteMessageSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid delete message payload");
      }
      const deleted = await syncQueries2.deleteMessage(parsed.data.messageId);
      if (deleted.success) {
        SyncIPCEmitter.emitMessageDeleted(parsed.data.messageId);
        if (deleted.chatId) {
          const chats = await syncQueries2.getAllChats();
          const updatedChat = chats.find((chat) => chat.id === deleted.chatId);
          if (updatedChat) {
            SyncIPCEmitter.emitChatUpdated(updatedChat);
          }
        }
        SyncIPCEmitter.emitChatListUpdated();
        return { success: true, data: { messageId: parsed.data.messageId } };
      }
      return { success: false, error: "Message not found" };
    } catch (error) {
      console.error("[IPC] Delete message failed:", error);
      return { success: false, error: "Failed to delete message" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.DELETE_CHAT, async (_event, rawPayload) => {
    try {
      const parsed = DeleteChatSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid delete chat payload");
      }
      const deleted = await syncQueries2.deleteChat(parsed.data.chatId);
      if (deleted.success) {
        SyncIPCEmitter.emitChatListUpdated();
        return { success: true, data: { chatId: parsed.data.chatId } };
      }
      return { success: false, error: "Chat not found" };
    } catch (error) {
      console.error("[IPC] Delete chat failed:", error);
      return { success: false, error: "Failed to delete chat" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.SEARCH_MESSAGES, async (_event, rawPayload) => {
    try {
      const parsed = SearchMessagesSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid search messages payload");
      }
      const { query, currentUser, limit, offset } = parsed.data;
      const results = await syncQueries2.searchMessages(
        query,
        currentUser || "You",
        limit ?? 50,
        offset ?? 0
      );
      return { success: true, data: results };
    } catch (error) {
      console.error("[IPC] Search messages failed:", error);
      return { success: false, error: "Failed to search messages" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.SEARCH_CHATS, async (_event, rawPayload) => {
    try {
      const parsed = SearchChatsSchema2.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid search chats payload");
      }
      const { query, limit, offset } = parsed.data;
      const results = await syncQueries2.searchChats(query, limit ?? 50, offset ?? 0);
      return { success: true, data: results };
    } catch (error) {
      console.error("[IPC] Search chats failed:", error);
      return { success: false, error: "Failed to search chats" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.TOGGLE_REACTION, async (_event, rawPayload) => {
    try {
      const parsed = ToggleReactionSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error("Invalid toggle reaction payload");
      }
      const { messageId, userId, emoji } = parsed.data;
      const reactions = await syncQueries2.toggleReaction(messageId, userId, emoji);
      SyncIPCEmitter.emitMessageReactionsUpdated({ messageId, reactions });
      return { success: true, data: { messageId, reactions } };
    } catch (error) {
      console.error("[IPC] Toggle reaction failed:", error);
      return { success: false, error: "Failed to toggle reaction" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.SELECT_ATTACHMENT, async (_event, rawPayload) => {
    try {
      const parsed = SelectAttachmentSchema.safeParse(rawPayload ?? {});
      if (!parsed.success) {
        throw new Error("Invalid select attachment payload");
      }
      const currentUser = parsed.data.currentUser ?? DEFAULT_CURRENT_USER3;
      const result = await import_electron5.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          { name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"] },
          { name: "Documents", extensions: ["pdf", "txt", "doc", "docx", "xls", "xlsx"] },
          { name: "All Files", extensions: ["*"] }
        ]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, error: "No file selected" };
      }
      const [sourcePath] = result.filePaths;
      if (!sourcePath) {
        return { success: false, error: "No file selected" };
      }
      const fileName = import_node_path2.default.basename(sourcePath);
      const stats = await import_node_fs.default.promises.stat(sourcePath);
      const mimeType = inferMimeType(sourcePath);
      const type = inferAttachmentType(mimeType);
      const safeUser = sanitizePathSegment(currentUser, DEFAULT_CURRENT_USER3);
      const uploadsBasePath = resolveUploadsBasePath();
      const uploadDir = import_node_path2.default.join(uploadsBasePath, "public", "uploads", safeUser);
      await import_node_fs.default.promises.mkdir(uploadDir, { recursive: true });
      let destinationPath = import_node_path2.default.join(uploadDir, fileName);
      if (import_node_fs.default.existsSync(destinationPath)) {
        const { name, ext } = import_node_path2.default.parse(fileName);
        destinationPath = import_node_path2.default.join(uploadDir, `${name}-${Date.now()}${ext}`);
      }
      await import_node_fs.default.promises.copyFile(sourcePath, destinationPath);
      return {
        success: true,
        data: {
          filePath: destinationPath,
          fileName,
          fileSize: stats.size,
          mimeType,
          type
        }
      };
    } catch (error) {
      console.error("[IPC] Select attachment failed:", error);
      return { success: false, error: "Failed to select attachment" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.SEED_LARGE_DATASET, async () => {
    try {
      const result = await syncQueries2.seedLargeDataset();
      SyncIPCEmitter.emitChatListUpdated();
      return { success: true, data: result };
    } catch (error) {
      console.error("[IPC] Seed dataset failed:", error);
      return { success: false, error: "Failed to seed dataset" };
    }
  });
  import_electron5.ipcMain.handle(IPC_EVENTS.CLEAR_ALL_DATA, async () => {
    try {
      await syncQueries2.clearAllData();
      SyncIPCEmitter.emitChatListUpdated();
      return { success: true };
    } catch (error) {
      console.error("[IPC] Clear data failed:", error);
      return { success: false, error: "Failed to clear data" };
    }
  });
  console.log("[IPC] Sync IPC handlers registered");
}

// electron/main.ts
var db = null;
var wsClient = null;
var syncQueries = null;
function initializeDatabase() {
  try {
    const Database = eval("require")("better-sqlite3");
    db = new Database("chats.db");
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        last_message TEXT,
        updated_at INTEGER NOT NULL,
        unread_count INTEGER DEFAULT 0
      );
    `);
    ensureMessageSchema(db, "You");
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    const chatCount = db.prepare("SELECT COUNT(*) as count FROM chats").get();
    if (chatCount.count === 0) {
      const insertChat = db.prepare(`
        INSERT INTO chats (id, name, last_message, updated_at, unread_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      const demoChats = [
        ["1", "Alice Johnson", "Hey, are you free later?", Date.now() - 1e3 * 60, 2],
        ["2", "Bob Smith", "Thanks for the help!", Date.now() - 1e3 * 60 * 5, 0],
        ["3", "Team Chat", "Meeting at 3pm", Date.now() - 1e3 * 60 * 15, 5],
        ["4", "Carol White", "Can you review this?", Date.now() - 1e3 * 60 * 30, 1],
        ["5", "David Brown", "Great work on the project", Date.now() - 1e3 * 60 * 60, 0]
      ];
      demoChats.forEach((chat) => insertChat.run(...chat));
      const insertMessage2 = db.prepare(`
        INSERT INTO messages (id, chat_id, sender, recipient, content, timestamp, read_at, is_edited)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const now = Date.now();
      const demoMessages = [
        // Chat 1 messages (Alice Johnson)
        ["m1", "1", "Alice Johnson", "You", "Hey, are you free later?", now - 1e3 * 60 * 10, null, 0],
        ["m2", "1", "You", "Alice Johnson", "Sure, what's up?", now - 1e3 * 60 * 8, null, 0],
        ["m3", "1", "Alice Johnson", "You", "Want to grab coffee?", now - 1e3 * 60 * 5, null, 0],
        ["m4", "1", "Alice Johnson", "You", "Hey, are you free later?", now - 1e3 * 60, null, 0],
        // Chat 2 messages (Bob Smith)
        ["m5", "2", "Bob Smith", "You", "Thanks for the help!", now - 1e3 * 60 * 5, null, 0],
        // Chat 3 messages (Team Chat)
        ["m6", "3", "Carol", "Team Chat", "Meeting at 3pm", now - 1e3 * 60 * 15, null, 0],
        ["m7", "3", "David", "Team Chat", "I'll be there", now - 1e3 * 60 * 12, null, 0],
        ["m8", "3", "You", "Team Chat", "Sounds good!", now - 1e3 * 60 * 10, null, 0]
      ];
      demoMessages.forEach((msg) => insertMessage2.run(...msg));
    }
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}
async function initializeWebSocketSync() {
  if (!db) {
    console.error("[SYNC] Database not initialized, cannot start sync");
    return;
  }
  try {
    syncQueries = new SyncQueries(db);
    wsClient = new WebSocketClient();
    wsClient.on("connected", () => {
      console.log("[SYNC] WebSocket connected");
      SyncIPCEmitter.emitConnectionConnected();
      SyncIPCEmitter.emitConnectionStatus(wsClient.getStatus());
    });
    wsClient.on("disconnected", () => {
      console.log("[SYNC] WebSocket disconnected");
      SyncIPCEmitter.emitConnectionDisconnected();
      SyncIPCEmitter.emitConnectionStatus(wsClient.getStatus());
    });
    wsClient.on("statusChange", (status) => {
      console.log("[SYNC] Status changed:", status);
      SyncIPCEmitter.emitConnectionStatus(status);
    });
    wsClient.on("syncEvent", async (event) => {
      console.log("[SYNC] Processing sync event:", event);
      await handleSyncEvent(event);
    });
    wsClient.on("error", (error) => {
      console.error("[SYNC] WebSocket error:", error);
    });
    wsClient.on("maxReconnectAttemptsReached", () => {
      console.error("[SYNC] Max reconnect attempts reached - going offline");
      SyncIPCEmitter.emitConnectionStatus(wsClient.getStatus());
    });
    await wsClient.connect();
    console.log("[SYNC] WebSocket sync initialized");
  } catch (error) {
    console.error("[SYNC] Failed to initialize WebSocket sync:", error);
  }
}
async function handleSyncEvent(event) {
  if (!syncQueries) {
    console.error("[SYNC] Sync queries not initialized");
    return;
  }
  try {
    switch (event.type) {
      case "new_message":
        if (!event.payload?.sender || !event.payload?.recipient) {
          console.error("[SYNC] new_message missing sender/recipient:", event.payload);
          return;
        }
        const currentUser = event.payload.recipient || "You";
        const messageInserted = await syncQueries.insertMessage(event.payload, currentUser);
        if (messageInserted) {
          const messages = await syncQueries.getMessagesForChat(event.payload.chat_id, 50, 0, currentUser);
          const fullMessage = messages.find((m) => m.id === event.payload.id);
          if (fullMessage) {
            SyncIPCEmitter.emitMessageInserted(fullMessage);
            const chats = await syncQueries.getAllChats();
            const chat = chats.find((c) => c.id === event.payload.chat_id);
            if (chat) {
              SyncIPCEmitter.showDesktopNotification(fullMessage, chat.name, currentUser);
            }
          }
          const updatedChats = await syncQueries.getAllChats();
          const updatedChat = updatedChats.find((c) => c.id === event.payload.chat_id);
          if (updatedChat) {
            SyncIPCEmitter.emitChatUpdated(updatedChat);
          }
          SyncIPCEmitter.emitChatListUpdated();
        }
        break;
      case "chat_update":
        const chatUpdated = await syncQueries.upsertChat(event.payload);
        if (chatUpdated) {
          const chats = await syncQueries.getAllChats();
          const fullChat = chats.find((c) => c.id === event.payload.chat_id);
          if (fullChat) {
            SyncIPCEmitter.emitChatUpdated(fullChat);
          }
          SyncIPCEmitter.emitChatListUpdated();
        }
        break;
      default:
        console.warn("[SYNC] Unknown sync event type:", event.type);
    }
  } catch (error) {
    console.error("[SYNC] Failed to handle sync event:", error);
  }
}
function getConnectionStatus() {
  return wsClient?.getStatus() || { status: "offline" };
}
async function simulateDisconnect() {
  if (!wsClient) {
    return { success: false };
  }
  console.log("[SYNC] Simulating connection drop...");
  await wsClient.simulateDisconnect();
  return { success: true };
}
async function forceReconnect() {
  if (!wsClient) {
    return { success: false };
  }
  console.log("[SYNC] Forcing reconnect...");
  await wsClient.forceReconnect();
  return { success: true };
}
function createMainWindow() {
  const mainWindow = new import_electron6.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: import_node_path3.default.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
  mainWindow.loadFile(import_node_path3.default.join(__dirname, "..", "src", "index.html"));
  if (!import_electron6.app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}
import_electron6.app.whenReady().then(async () => {
  if (process.platform === "win32") {
    import_electron6.app.setAppUserModelId(import_electron6.app.getName());
  }
  initializeDatabase();
  await initializeWebSocketSync();
  registerAuthIpcHandlers(import_electron6.ipcMain);
  registerMessageIpc();
  registerSyncIpc();
  registerChatsIpc(db);
  if (syncQueries) {
    console.log("[Main] Registering sync IPC handlers...");
    registerSyncIPCHandlers(syncQueries);
    console.log("[Main] Sync IPC handlers registered successfully");
  } else {
    console.warn("[Main] syncQueries is null, creating fallback...");
    if (db) {
      syncQueries = new SyncQueries(db);
      console.log("[Main] Created fallback syncQueries, registering handlers...");
      registerSyncIPCHandlers(syncQueries);
      console.log("[Main] Fallback sync IPC handlers registered successfully");
    } else {
      console.error("[Main] Database is null - cannot create fallback syncQueries");
    }
  }
  import_electron6.ipcMain.handle("sync:get-connection-status", () => {
    return getConnectionStatus();
  });
  import_electron6.ipcMain.handle("sync:simulate-disconnect", async () => {
    return await simulateDisconnect();
  });
  import_electron6.ipcMain.handle("sync:force-reconnect", async () => {
    return await forceReconnect();
  });
  createMainWindow();
  import_electron6.app.on("activate", () => {
    if (import_electron6.BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
import_electron6.app.on("window-all-closed", async () => {
  if (wsClient) {
    await wsClient.disconnect();
    wsClient = null;
  }
  if (process.platform !== "darwin") {
    import_electron6.app.quit();
  }
});
import_electron6.app.on("before-quit", async () => {
  if (wsClient) {
    await wsClient.disconnect();
  }
});
