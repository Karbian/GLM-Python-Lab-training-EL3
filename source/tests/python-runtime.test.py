"""Execute the practice models and the worker's Python adapter in native Python."""
import ast
import json
import sys

payload = json.load(sys.stdin)
tree = ast.parse(payload['wrapper'])
statements = compile(ast.Module(body=tree.body[:-1], type_ignores=[]), '<adapter>', 'exec')
expression = compile(ast.Expression(tree.body[-1].value), '<result>', 'eval')

def run(code, inputs):
    scope = {'_request_json': json.dumps({'code': code, 'inputs': inputs})}
    exec(statements, scope)
    return json.loads(eval(expression, scope))

cases = 0
for challenge in payload['challenges']:
    for case in challenge['tests']:
        actual = run(challenge['solution'], case['inputs'])
        assert not actual['error'], (challenge['id'], actual)
        assert actual['output'].strip() == case['expected'], (challenge['id'], case, actual)
        cases += 1
    broken = run(challenge['starter'], challenge['tests'][0]['inputs'])
    assert 'SyntaxError' in broken['error'], (challenge['id'], broken)

assert run('print(input("Prompt: "))', ['Hello'])['output'] == 'Hello\n'
assert 'EOFError' in run('input()', [])['error']
assert 'ZeroDivisionError' in run('print(1 / 0)', [])['error']
assert 'Output limit reached' in run('print("x" * 21000)', [])['error']
assert run('private_value = 123', [])['error'] == ''
assert 'NameError' in run('print(private_value)', [])['error']
assert run('print("Recovered")', [])['output'] == 'Recovered\n'
print(f'{cases} model cases passed; 3 broken starters and 7 adapter behaviors checked.')
