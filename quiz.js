(() => {
    const root = document.getElementById('mkd-quiz-196');
    const $ = id => root.querySelector('#mq-' + id);
    const data = window.AlexOSQuizQuestions;
    const bank = new Map(data.map(q => [q.id, q]));
    const scored = data.filter(q => !q.review).map(q => q.id);
    const disputed = data.filter(q => q.review).map(q => q.id);
    const SCHEMA = 'mkd-196-20261019-v1';
    let session = null;
    let screen = 'menu';
    const labels = {train:'Тренировка', exam:'Пробный экзамен', all:'Весь перечень', review:'Спорные вопросы', key:'Ответы и пояснения', mistakes:'Повторение ошибок'};
    function restored(raw) {
      const p = raw?.privateContent || raw;
      const s = p?.session;
      if (p?.schema !== SCHEMA || !s || !Array.isArray(s.ids) || !s.ids.length || !s.ids.every(id => bank.has(id)) || !labels[s.mode]) return null;
      if (new Set(s.ids).size !== s.ids.length) return null;
      const choices = {};
      for (const [id, a] of Object.entries(s.choices || {})) if (s.ids.includes(Number(id)) && Number.isInteger(a) && a >= 0 && a <= 2) choices[id] = a;
      const checked = {};
      for (const id of s.ids) if (s.checked?.[id]) checked[id] = true;
      return { mode:s.mode, ids:s.ids, pos:Math.min(s.ids.length-1,Math.max(0,Number(s.pos)||0)), choices, checked, done:!!s.done, deadline:s.mode==='exam' && Number.isFinite(s.deadline) ? s.deadline : null };
    }
    function counts() {
      if (!session) return {correct:0, wrong:0, unanswered:0, total:0, reviewed:0};
      let correct=0, wrong=0, unanswered=0, total=0, reviewed=0;
      for (const id of session.ids) {
        const q=bank.get(id), a=session.choices[id];
        if (q.review) { if(session.checked[id]||session.done) reviewed++; continue; }
        total++;
        if (a === undefined) unanswered++;
        else if(q.a.includes(a)) correct++;
        else wrong++;
      }
      return {correct,wrong,unanswered,total,reviewed};
    }
    const STORAGE_KEY = 'alexos.mkd-quiz.v1';
    function save() {
      if (!session) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({schema:SCHEMA,session})); }
      catch (_) { document.getElementById('mq-storage-note').textContent='Браузер не разрешает сохранять прогресс. Текущая попытка доступна до закрытия страницы.'; }
    }
    function shuffle(ids) {
      const a=[...ids];
      for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
      return a;
    }
    function start(mode, ids) {
      let list=ids;
      if(!list) list=(mode==='all'||mode==='key')?data.map(q=>q.id):mode==='review'?[...disputed]:shuffle(scored).slice(0,mode==='exam'?100:20);
      if(!list.length)return;
      session={mode,ids:list,pos:0,choices:{},checked:{},done:false,deadline:mode==='exam'?Date.now()+120*60*1000:null};
      screen='session';save();draw();
    }
    function menuInfo() {
      const messages={train:'Ответ и пояснение после каждого вопроса. 20 вопросов из 180 с учебным ключом.',exam:'100 вопросов из 180 без спорных. Порог — 85 правильных; ответы и разбор появятся после завершения.',all:'Все исходные вопросы по порядку. 16 спорных вопросов доступны для разбора без оценки.',key:'Учебный ключ, пояснение и ссылка на норму для каждого вопроса. В спорных вопросах — правовой ориентир вместо оценки.',review:'16 неоднозначных вопросов: варианты, правовая оценка и ссылка на норму. Без выставления баллов.'};
      $('mode-info').textContent=messages[$('mode').value];
      $('resume').hidden=!session;
      $('resume').textContent=session?.done?'Открыть результат':'Продолжить начатое';
    }
    function tick() {
      if(!session||session.mode!=='exam')return;
      const left=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));
      $('clock').textContent='Осталось '+String(Math.floor(left/3600)).padStart(2,'0')+':'+String(Math.floor(left%3600/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
      if(left===0&&!session.done)finish();
    }
    function feedback(q) {
      const el=$('feedback');el.replaceChildren();
      const show=session.done || session.mode==='review' || session.mode==='key' || session.checked[q.id];
      el.hidden=!show;
      if(!show)return;
      const title=document.createElement('div');
      const choice=session.choices[q.id];
      if(q.review) title.textContent=q.a.length?'Без оценки · правовой ориентир — вариант '+(q.a[0]+1):'Без оценки · полностью корректного варианта нет';
      else if(choice===undefined)title.textContent=(session.mode==='key'?'Учебный ключ · вариант ':'Ответ не выбран · правильный вариант ')+(q.a[0]+1);
      else {const good=q.a.includes(choice);title.textContent=good?'Верно':'Неверно · правильный вариант '+(q.a[0]+1);title.className=good?'mq-good':'text-destructive';}
      el.append(title);
      if(!q.review && q.a.length){const answer=document.createElement('div');answer.textContent='Правильный ответ: '+q.o[q.a[0]];el.append(answer);}
      const note=document.createElement('div');note.textContent=q.explain;el.append(note);
      const a=document.createElement('a');a.href=q.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=q.cite;a.className='text-small';el.append(a);
    }
    function drawQuestion() {
      const q=bank.get(session.ids[session.pos]);
      const c=counts();
      $('position').textContent=labels[session.mode]+' · '+(session.pos+1)+' / '+session.ids.length;
      const processed=session.ids.filter(id=>session.choices[id]!==undefined || session.checked[id]).length;
      $('score').textContent=session.mode==='exam'&&!session.done?'Ответов: '+(c.total-c.unanswered)+' / '+c.total:'Верно: '+c.correct+' · с ответом: '+(c.total-c.unanswered)+' / '+c.total;
      if(session.mode==='review'||session.mode==='key')$('score').textContent='Справочник · без оценки';
      $('progress').hidden=session.mode==='review'||session.mode==='key';
      const p=Math.round(processed/session.ids.length*100);
      $('progress').setAttribute('aria-valuenow',String(p));$('bar').style.width=p+'%';
      $('clock').hidden=session.mode!=='exam';tick();
      $('tag').textContent='№ '+q.id+' в официальном перечне'+(q.review?' · спорная формулировка, без оценки':'');
      $('question').textContent=q.q;
      const options=$('options');options.replaceChildren();
      const locked=session.done || session.mode==='review' || session.mode==='key' || (session.mode!=='exam'&&session.checked[q.id]);
      q.o.forEach((option,i)=>{
        const label=document.createElement('label');label.className='form-check';
        const input=document.createElement('input');input.className='form-check-input';input.type='radio';input.name='mq-answer';input.value=String(i);input.checked=session.choices[q.id]===i;input.disabled=!!locked;
        const span=document.createElement('span');span.className='form-check-label';span.textContent=(i+1)+'. '+option;
        input.addEventListener('change',()=>{session.choices[q.id]=i;save();$('check').disabled=false;if(session.mode==='exam')drawQuestion();});
        label.append(input,span);options.append(label);
      });
      const jump=session.mode==='all'||session.mode==='review'||session.mode==='key'||session.done;
      $('jump-wrap').hidden=!jump;
      if(jump){$('jump').replaceChildren();for(const id of session.ids){const op=document.createElement('option');op.value=String(id);op.textContent='№ '+id+(bank.get(id).review?' · без оценки':'');op.selected=id===q.id;$('jump').append(op);}}
      $('check').hidden=session.mode==='exam'||session.mode==='review'||session.mode==='key'||session.done||!!session.checked[q.id];
      $('check').textContent=q.review?'Показать разбор':'Проверить ответ';
      $('check').disabled=!q.review&&session.choices[q.id]===undefined;
      $('prev').disabled=session.pos===0;
      $('next').disabled=session.pos===session.ids.length-1;
      $('finish').hidden=session.mode==='key'||session.mode==='review';
      $('finish').textContent=session.done?'К результатам':session.mode==='exam'?'Завершить экзамен':'Завершить';
      feedback(q);
    }
    function mistakes() {
      if(!session)return [];
      return session.ids.filter(id=>!bank.get(id).review&&!bank.get(id).a.includes(session.choices[id]));
    }
    function drawResult() {
      const c=counts();const failed=mistakes();
      $('result-title').textContent=session.mode==='exam'?(c.correct>=85?'Учебный экзамен сдан':'Учебный экзамен не сдан'):'Результат';
      $('result-score').textContent=c.total?'Правильных ответов: '+c.correct+' из '+c.total+' · '+Math.round(c.correct/c.total*100)+'%':'Разбор спорных вопросов завершён';
      $('result-detail').textContent=c.total?'Ошибок: '+c.wrong+' · пропусков: '+c.unanswered+(session.ids.some(id=>bank.get(id).review)?' · спорные вопросы не учитываются':''):'Все 16 вопросов требуют внимательного чтения нормы и уточнения формулировки.';
      $('repeat').hidden=!failed.length;
      $('view-answers').textContent=c.total?'Посмотреть ответы':'Вернуться к разбору';
      $('mistake-wrap').hidden=!failed.length;
      $('mistakes').replaceChildren();
      for(const id of failed){const b=document.createElement('button');b.className='btn';b.type='button';b.textContent='№ '+id;b.addEventListener('click',()=>{session.pos=session.ids.indexOf(id);screen='session';save();draw();});$('mistakes').append(b);}
    }
    function draw() {
      $('menu').hidden=screen!=='menu';$('session').hidden=screen!=='session';$('results').hidden=screen!=='result';
      if(screen==='menu')menuInfo();
      else if(screen==='session')drawQuestion();
      else drawResult();
    }
    function finish() {if(!session)return;session.done=true;screen='result';save();draw();}
    $('mode').addEventListener('change',menuInfo);
    $('start').addEventListener('click',()=>start($('mode').value));
    $('resume').addEventListener('click',()=>{if(session){screen=session.done?'result':'session';draw();}});
    $('menu-button').addEventListener('click',()=>{screen='menu';save();draw();});
    $('results-menu').addEventListener('click',()=>{screen='menu';save();draw();});
    $('check').addEventListener('click',()=>{const q=bank.get(session.ids[session.pos]);if(session.choices[q.id]===undefined&&!q.review)return;session.checked[q.id]=true;save();draw();});
    $('prev').addEventListener('click',()=>{if(session.pos>0){session.pos--;save();draw();}});
    $('next').addEventListener('click',()=>{if(session.pos<session.ids.length-1){session.pos++;save();draw();}});
    $('jump').addEventListener('change',()=>{const pos=session.ids.indexOf(Number($('jump').value));if(pos>=0){session.pos=pos;save();draw();}});
    $('finish').addEventListener('click',finish);
    $('view-answers').addEventListener('click',()=>{session.pos=0;screen='session';save();draw();});
    $('repeat').addEventListener('click',()=>{const ids=mistakes();start('mistakes',ids);});
    try { session=restored(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); } catch (_) {}
    setInterval(tick,1000);
    draw();
  })();
