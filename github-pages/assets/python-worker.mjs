// Pin the official stable runtime. The UI stays responsive in a module worker.
const BASE='https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let runtime;
async function ready(){if(!runtime){const {loadPyodide}=await import(BASE+'pyodide.mjs');runtime=await loadPyodide({indexURL:BASE});}return runtime;}
const runner=`
import io, json, traceback, contextlib, builtins
_request = json.loads(_request_json)
_inputs = iter(_request['inputs'])
_used = 0
class _BoundedOutput(io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 20000:
            raise RuntimeError('Output limit reached. Check your loop and try again.')
        return super().write(text)
_out = _BoundedOutput()
_error = ''
def _read_input(prompt=''):
    global _used
    try:
        value = next(_inputs)
    except StopIteration:
        raise EOFError('Add one input value per line in the Inputs box, in the order requested.')
    _used += 1
    return value
_builtins = vars(builtins).copy()
_builtins['input'] = _read_input
_namespace = {'__name__': '__main__', '__builtins__': _builtins}
try:
    with contextlib.redirect_stdout(_out), contextlib.redirect_stderr(_out):
        exec(compile(_request['code'], '<student>', 'exec'), _namespace, _namespace)
except BaseException:
    _error = traceback.format_exc(limit=5)
json.dumps({'output': _out.getvalue(), 'error': _error, 'inputsUsed': _used})
`;
self.onmessage=async event=>{
 const {id,code,inputs}=event.data;
 try{self.postMessage({id,status:'loading'});const py=await ready();self.postMessage({id,status:'running'});py.globals.set('_request_json',JSON.stringify({code,inputs}));const result=JSON.parse(await py.runPythonAsync(runner));self.postMessage({id,status:'done',...result});}
 catch(error){self.postMessage({id,status:'failed',error:'Python could not load or run. Check your connection, or download your code and use GLM Python Lab. '+String(error.message||error)});}
};
