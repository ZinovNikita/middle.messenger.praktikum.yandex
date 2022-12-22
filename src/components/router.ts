import Route from './route';
class Router implements RouterType {
    private static instance:RouterType;
    public static Init (rootElement?:Element|null):RouterType {
        if (!this.instance && rootElement !== undefined && rootElement !== null) { this.instance = new this(rootElement); }
        return this.instance;
    }

    private constructor (rootElement:Element) {
        this.rootElement = rootElement;
    }

    private rootElement:Element;
    private routes:RouteType[] = [];
    private history:History = window.history;
    private currentRoute:RouteType|null = null;

    private _onRoute (pathname:string) {
        const route = this.$getRoute(pathname);
        if (!route) {
            this._onRoute('/404');
            return;
        }
        if (this.currentRoute) {
            this.currentRoute.$leave();
        }
        route.$render();
        this.currentRoute = route;
    }

    public $use (pathname:string, block:ViewConstructor, props?: Obj) {
        if (this.rootElement !== null) {
            const route = new Route(pathname, this.rootElement, block, props);
            this.routes.push(route);
        }
        return this;
    }

    public $start () {
        window.addEventListener('popstate', (event:any) => {
            this._onRoute(event.currentTarget.location.pathname);
        });
        this._onRoute(window.location.pathname);
    }

    public $go (pathname:string) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    public $getRoute (pathname:string) {
        return this.routes.find(route => route.$match(pathname));
    }

    public $match (pathname:string):boolean {
        return this.currentRoute?.$match(pathname);
    }
}

export default Router;
