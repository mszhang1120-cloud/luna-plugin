#!/usr/bin/env node
// repo-grade — AI-Ready 채점 스크립트 (단순 버전)

const fs = require('fs');
const path = require('path');

const CATEGORIES = [
  { id: 'A', name: 'Navigation & Coverage', weight: 15 },
  { id: 'B', name: 'Context Doc Quality', weight: 20 },
  { id: 'C', name: 'Tribal Knowledge', weight: 20 },
  { id: 'D', name: 'Dependency & Data Flow', weight: 15 },
  { id: 'E', name: 'Verification Gates', weight: 15 },
  { id: 'F', name: 'Freshness', weight: 10 },
  { id: 'G', name: 'Agent Outcomes', weight: 5 }
];

function checkFileExists(p) {
  return fs.existsSync(path.join(process.cwd(), p));
}

function run() {
  const results = [];
  let total = 0;

  // A: Navigation - 핵심 파일 존재 여부
  const hasReadme = checkFileExists('README.md');
  const hasClaudeMd = checkFileExists('CLAUDE.md');
  const hasPkg = checkFileExists('package.json');
  const aScore = (hasReadme + hasClaudeMd + hasPkg) / 3 * 15;
  results.push({ cat: 'A', score: Math.round(aScore), evidence: `README:${hasReadme} CLAUDE.md:${hasClaudeMd} package.json:${hasPkg}` });
  total += aScore;

  // B: Context Doc Quality - CLAUDE.md 길이 체크
  let bScore = 0;
  if (hasClaudeMd) {
    const content = fs.readFileSync('CLAUDE.md', 'utf-8');
    const lines = content.split('\n').length;
    bScore = lines >= 25 && lines <= 35 ? 20 : Math.max(5, 20 - Math.abs(lines - 30));
  }
  results.push({ cat: 'B', score: Math.round(bScore), evidence: `CLAUDE.md ${hasClaudeMd ? '존재' : '없음'}` });
  total += bScore;

  // C: Tribal Knowledge - _brain 폴더나 ADR 존재
  const hasBrain = checkFileExists('_brain');
  const cScore = hasBrain ? 20 : 5;
  results.push({ cat: 'C', score: cScore, evidence: `_brain 폴더: ${hasBrain ? '있음' : '없음'}` });
  total += cScore;

  // D: Dependency & Data Flow - package.json 의존성
  let dScore = 5;
  if (hasPkg) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const deps = Object.keys({...pkg.dependencies, ...pkg.devDependencies}).length;
    dScore = Math.min(15, 5 + deps);
  }
  results.push({ cat: 'D', score: Math.round(dScore), evidence: `의존성 개수 기반` });
  total += dScore;

  // E: Verification Gates - 테스트/린트 스크립트
  let eScore = 0;
  if (hasPkg) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const scripts = pkg.scripts || {};
    if (scripts.test) eScore += 5;
    if (scripts.lint) eScore += 5;
    if (scripts.build) eScore += 5;
  }
  results.push({ cat: 'E', score: eScore, evidence: `scripts: test/lint/build` });
  total += eScore;

  // F: Freshness - git 최근 커밋에서 문서 갱신 여부
  const fScore = 10; // 단순화
  results.push({ cat: 'F', score: fScore, evidence: '단순화: 10점 부여' });
  total += fScore;

  // G: Agent Outcomes - 미구현
  const gScore = 5;
  results.push({ cat: 'G', score: gScore, evidence: '미구현: 기본 5점' });
  total += gScore;

  // 출력
  console.log('\n=== repo-grade 리포트 ===');
  results.forEach(r => {
    console.log(`${r.cat}. ${CATEGORIES.find(c => c.id === r.cat).name}: ${r.score}/${CATEGORIES.find(c => c.id === r.cat).weight} — ${r.evidence}`);
  });
  console.log(`\n총점: ${Math.round(total)}/100`);

  // ROI 상위 2개 제안
  const sorted = [...results].sort((a, b) => {
    const wa = CATEGORIES.find(c => c.id === a.cat).weight;
    const wb = CATEGORIES.find(c => c.id === b.cat).weight;
    const gapA = wa - a.score;
    const gapB = wb - b.score;
    return gapB - gapA;
  });
  console.log('\n🎯 ROI 개선 제안 (상위 2):');
  sorted.slice(0, 2).forEach(r => {
    const cat = CATEGORIES.find(c => c.id === r.cat);
    console.log(`  - ${r.cat}. ${cat.name} (현재 ${r.score}/${cat.weight}) — 격차 ${cat.weight - r.score}점`);
  });

  // JSON 저장
  const report = { timestamp: new Date().toISOString(), total: Math.round(total), details: results };
  fs.writeFileSync('repo-grade-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 repo-grade-report.json 저장됨');
}

run();
