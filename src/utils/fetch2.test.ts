import { expect } from 'chai';
import fetch2 from './fetch2';
describe('Fetch2',() => {
    it('get',async () => {
        const res = await fetch2.$get('/test1');
        expect((res as any).result).to.eq('done')
    })
    it('post',async () => {
        const res = await fetch2.$post('/test2',{
            params: { par1: 1, par2: 'text' }
        });
        expect((res as any).result).to.eq('done')
    })
    it('put',async () => {
        const fd:FormData = new window.FormData();
        fd.append('par1', '123');
        fd.append('par2', 'file');
        const res = await fetch2.$put('/test3',{ headers: undefined, body: fd });
        expect((res as any).result).to.eq('done')
    })
    it('delete',async () => {
        const res = await fetch2.$put('/test4', {
            headers: {
                key1: 'val1',
                key2: 'val2'
            }
        });
        expect((res as any).result).to.eq('done')
    })
})
