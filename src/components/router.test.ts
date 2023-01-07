import { expect } from 'chai';
import Component from './component';
import Router from './router';
describe('Router',() => {
    const app = document.querySelector('#app')
    expect(app).to.not.eq(null)
    if (app != null) {
        class Page1 extends Component {
            constructor () {
                super('page1', 'div', {})
            }

            public $title: string = 'Page1';
        }
        class Page2 extends Component {
            constructor () {
                super('page2', 'div', {})
            }

            public $title: string = 'Page2';
        }
        const router = Router.Init(app);
        router.$use('/',Page1)
            .$use('/page2',Page2)
            .$use('/page1',Page1)
        it('go root',() => {
            router.$go('/')
            expect(document.title).to.eq('Page1')
        })

        it('go page2',() => {
            router.$go('/page2')
            expect(document.title).to.eq('Page2')
        })

        it('go page1',() => {
            router.$go('/page1')
            expect(document.title).to.eq('Page1')
        })
    }
})
