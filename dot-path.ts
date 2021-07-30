export type Primitive =
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
    ? false
    : true;
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type ArrayKey = number

type PathImpl<K, V> = K extends string | number
    ? V extends Primitive
        ? `${K}`
        : `${K}` | `${K}.${Path<V>}`
    : never;

export type Path<T> = T extends ReadonlyArray<infer V>
    ? IsTuple<T & any[]> extends true
        ? {
            [K in TupleKey<T>]-?: PathImpl<K, T[K]>;
        }[TupleKey<T>]
        : PathImpl<ArrayKey, V>
    : {
        [K in keyof T]-?: PathImpl<K, T[K]>;
    }[keyof T];

export type PathValue<
    T,
    P extends Path<T>
    > = P extends `${infer K}.${infer R}`
    ? K extends keyof T
        ? R extends Path<T[K]>
            ? PathValue<T[K], R>
            : never
        : K extends `${ArrayKey}`
            ? T extends ReadonlyArray<infer V>
                ? PathValue<V, R & Path<V>>
                : never
            : never
    : P extends keyof T
        ? T[P]
        : P extends `${ArrayKey}`
            ? T extends ReadonlyArray<infer V>
                ? V
                : never
            : never;

declare function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P>;

type Obj = {
    str: string;
    num: number;
    strOrObj: string | {
        name: string;
        contributors: number;
    }
    optionalNum?: number;
    tuple1: [string, number];
    tuple2: [{
        name: string;
        contributors: number;
    }, {
        name: string;
        contributors: number;
    }];
    tuple3: [
        number,
        {
            name: string;
            contributors: number;
        }
    ];
    optionalTuple?: [{
        name: string;
        contributors: number;
    }, {
        name: string;
        contributors: number;
    }]
    array1: string[];
    array2: {
        name: string;
        contributors: number;
    }[];
    arrayNullable?: null | {
        name: string;
        contributors: number;
    }[]
    object: {
        name: string;
        contributors: number;
    };
};

const object: Obj = {} as any;

let num = 1;

get(object, "notExists");
get(object, "str");
get(object, "num");
get(object, "strOrObj");
get(object, "strOrObj.name");
get(object, "strOrObj.contributors");
get(object, "optionalNum");
get(object, "tuple1.0");
get(object, "tuple1.1");
get(object, "tuple1.2");
get(object, "tuple2.0");
get(object, "tuple2.1.contributors");
get(object, "tuple2.2");
get(object, "tuple3.0");
get(object, "tuple3.0.name");
get(object, "tuple3.1.name");
get(object, "tuple3.1.contributors");
get(object, "tuple3.2");
get(object, "optionalTuple");
get(object, "optionalTuple.0.contributors");
get(object, "optionalTuple.1.name");
get(object, "optionalTuple.2");
get(object, "array1.1002");
get(object, `array1.${num}` as const);
get(object, "array2.0.contributors");
get(object, "array2.56.contributors");
get(object, "array2.1004.name");
get(object, `array2.${num}.contributors` as const);
get(object, "arrayNullable")
get(object, "arrayNullable.0")
get(object, "arrayNullable.0.name")
get(object, "object.contributors");
