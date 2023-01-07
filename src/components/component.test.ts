import { expect } from 'chai';
import Component from './component';

describe('Template',() => {
    it('app Element is not null',() => {
        const app = document.querySelector('#app')
        expect(app).to.not.eq(null)
    })
    it('Template is correct',() => {
        const cmp = new Component('templateCheck','b', {});
        const app = document.querySelector('#app')
        if (app != null) {
            cmp.$attach(app);
            const txt = document.querySelector('#app b')?.textContent;
            expect(txt).to.eq('templateCheck')
        }
    })
})
describe('Component',() => {
    it('check on-helper of Component',() => {
        let txt = '';
        const callback = () => {
            txt = 'done'
        }
        class TestComponent extends Component {
            testCallbcak = callback
        }
        const cmp = new TestComponent('<button {{on \'click\' \'testCallbcak\'}}></button>','div', {});
        const app = document.querySelector('#app')
        if (app != null) {
            cmp.$attach(app);
            const btn = document.querySelector('#app button');
            if (btn != null) {
                (btn as HTMLElement).click()
                expect(txt).to.eq('done')
            }
        }
    })
})
