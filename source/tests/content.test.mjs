import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {lessons,challenges,answerMatches,outputMatches} from '../dist/assets/content.mjs';

test('The study path has twelve distinct checks and accepts every displayed answer',()=>{
 const checks=lessons.flatMap(l=>l.checks);
 assert.equal(lessons.length,6);assert.equal(checks.length,12);
 assert.equal(new Set(checks.map(c=>c.id)).size,12);
 for(const check of checks){assert.ok(check.hint&&check.why);for(const answer of check.answers)assert.ok(answerMatches(answer,check.answers),check.id);assert.ok(!answerMatches('not an answer',check.answers),check.id);}
 assert.ok(answerMatches(' "COST: 10.0" ',['Cost: 10.0']));
});

test('Required output checks catch wrong branches and values while allowing an appended feature',()=>{
 assert.ok(outputMatches('On target\nPace: 5.0\nExtra: 0\n','On target\nPace: 5.0'));
 assert.ok(!outputMatches('Below target\nPace: 5.0','On target\nPace: 5.0'));
 assert.ok(!outputMatches('On target\nPace: 9.0','On target\nPace: 5.0'));
 assert.ok(!outputMatches('On target','On target\nPace: 5.0'));
});

test('Progress round trips restore work, reject invalid files and refresh imported test results',()=>{
 const app=readFileSync(new URL('../dist/assets/app.mjs',import.meta.url),'utf8');
 const source=app.slice(app.indexOf('function validateProgress('),app.indexOf('\nfunction persist('));
 const validate=new Function('lessons','challenges','answerMatches',"const clean=s=>typeof s==='string'?s:'';\n"+source+'\nreturn validateProgress;')(lessons,challenges,answerMatches);
 const raw={version:1,lesson:2,view:'lab',challenge:'pace',checks:{'input-a':{answer:'73',attempts:1,passed:true}},drafts:{pace:{code:challenges[0].solution,inputs:'12\n3\n5',predictions:challenges[0].tests.map(t=>t.expected),logs:['A type repair','','',''],improvement:'Extra output',explanation:'The pace divides pages by minutes.',attempts:2,hintCount:1,model:false,testedCode:challenges[0].solution,results:challenges[0].tests.map(t=>({output:t.expected,error:''}))}}};
 const restored=validate(JSON.parse(JSON.stringify(raw)));
 assert.ok(restored.checks['input-a'].passed);assert.equal(restored.drafts.pace.code,raw.drafts.pace.code);
 assert.equal(restored.drafts.pace.explanation,raw.drafts.pace.explanation);assert.equal(restored.drafts.pace.results.length,4);
 const imported=validate(JSON.parse(JSON.stringify(raw)),true);
 assert.equal(imported.drafts.pace.results.length,0);assert.equal(imported.drafts.pace.testedCode,'');assert.deepEqual(imported.drafts.pace.predictions,raw.drafts.pace.predictions);
 assert.throws(()=>validate({version:99}));assert.throws(()=>validate(null));
 const unverified=structuredClone(raw);unverified.checks['input-a'].passed=false;
 assert.equal(validate(unverified).checks['input-a'].passed,false);
});

test('Every practice model runs correctly in real Python and runtime errors are recoverable',()=>{
 const worker=readFileSync(new URL('../dist/assets/python-worker.mjs',import.meta.url),'utf8');
 const wrapper=worker.split('const runner=`\n')[1].split('\n`;')[0];
 assert.ok(wrapper.includes("compile(_request['code']"));
 const result=spawnSync(process.env.PYTHON||'python3',[new URL('./python-runtime.test.py',import.meta.url).pathname],{input:JSON.stringify({challenges,wrapper}),encoding:'utf8',timeout:20000});
 assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stdout,/12 model cases passed/);
});
