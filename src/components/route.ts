import { isEqual } from '../utils';

export default class Route {
    constructor (pathname:string, rootElement:Element, pageClass:ViewConstructor, props?:Obj) {
        this.pathname = pathname;
        this.pageClass = pageClass;
        this.page = null;
        this.props = props;
        this.rootElement = rootElement;
    }

    private rootElement:Element;
    private pathname:string;
    private pageClass:ViewConstructor;
    private page:ComponentType|null;
    private props:Obj|undefined;

    $navigate (pathname:string) {
        if (this.$match(pathname)) {
            this.pathname = pathname;
            this.$render();
        }
    }

    $leave () {
        if (this.page) {
            this.page.$hide();
        }
    }

    $match (pathname:string):boolean {
        return isEqual(pathname, this.pathname);
    }

    $render () {
        if (!this.page) {
            const Cls:ViewConstructor = this.pageClass;
            if (this.props === undefined) { this.props = {} }
            this.page = new Cls(this.props);
        }
        this.page.$attach(this.rootElement);
        document.title = this.page.$title
    }
}
