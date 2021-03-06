// Generated by typings
// Source: https://raw.githubusercontent.com/atmajs/utest/master/types/global.d.ts
declare module "atma-utest" {
	export = UTest;
}

declare function UTest(definition: IUTestDefinition): void

interface IUTestDefinition {
    $config?: {
        timeout: number
        errorableCallbacks: boolean
        breakOnError: boolean

        'http.config': any
        'http.eval': string
        'http.include': any
        'http.service': any
        'http.process': any
        'util.process': any   
    }
    $before?: (done?: Function) => void | IDeferredLike
    $after?: (done?: Function) => void | IDeferredLike
    $teardown?: (done?: Function) => void | IDeferredLike

    [key: string]: ITestCase | IUTestDefinition | any
}

interface ITestCase {
    (done?: Function, ...args: any[]): void | IDeferredLike | any
}

interface IDeferredLike {
    then(done: Function, fail?: Function): void | any
}
