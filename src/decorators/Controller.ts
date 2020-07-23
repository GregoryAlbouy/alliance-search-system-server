/**
 * Class decorator for controllers.
 * Unused for the moment.
 * 
 * The idea is to:
 * - create the empty route array to be filled by Route method decorators
 * - add some default route options (e.g. base path, auth strategy...)
 * in order to reduce Route decorator options
 * 
 * BUT.
 * 
 * It can't be used that way because of TypeScript decorators behaviour,
 * which calls method decorators BEFORE class decorators
 */

const Controller = () => {
    return (target: any) => {
        target.routes = []
        console.log('controller.ts: ', target)
    }
}

export default Controller