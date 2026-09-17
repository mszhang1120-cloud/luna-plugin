#!/usr/bin/env node
// token-report.js — Claude Code 세션 토큰 사용량 분석기

const fs = require('fs');
const path = require('path');

function parseJSONL(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const usage = [];
  let skipped = 0;

  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      if (data.usage) {
        usage.push({
          input: data.usage.input_tokens || 0,
          output: data.usage.output_tokens || 0,
          cache_write: data.usage.cache_creation_input_tokens || 0,
          cache_read: data.usage.cache_read_input_tokens || 0
        });
      }
    } catch {
      skipped++;
    }
  }
  return { usage, skipped };
}

function main() {
  const logDir = process.argv[2] || path.join(process.env.HOME, '.claude', 'projects');
  let files = [];

  try {
    const projectDirs = fs.readdirSync(logDir);
    for (const dir of projectDirs) {
      const projectPath = path.join(logDir, dir);
      if (fs.statSync(projectPath).isDirectory()) {
        const jsonlFiles = fs.readdirSync(projectPath)
          .filter(f => f.endsWith('.jsonl'))
          .map(f => path.join(projectPath, f));
        files.push(...jsonlFiles);
      }
    }
  } catch (e) {
    console.error('로그 디렉토리 접근 실패:', e.message);
    process.exit(0);
  }

  if (files.length === 0) {
    console.log('분석할 JSONL 파일을 찾을 수 없습니다.');
    process.exit(0);
  }

  // 가장 최근 파일 1개만 분석 (간소화)
  const latestFile = files.sort((a, b) => 
    fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime()
  )[0];

  const { usage, skipped } = parseJSONL(latestFile);

  let totalInput = 0, totalOutput = 0, totalCacheWrite = 0, totalCacheRead = 0;
  for (const u of usage) {
    totalInput += u.input;
    totalOutput += u.output;
    totalCacheWrite += u.cache_write;
    totalCacheRead += u.cache_read;
  }

  const cacheHitRate = (totalInput + totalCacheRead) > 0 
    ? (totalCacheRead / (totalInput + totalCacheRead) * 100).toFixed(1) 
    : 0;
  const outputInputRatio = totalInput > 0 ? (totalOutput / totalInput).toFixed(2) : 'N/A';

  console.log(`파일: ${path.basename(latestFile)}`);
  console.log(`Turns: ${usage.length} | Input: ${totalInput} | Output: ${totalOutput} | Cache Write: ${totalCacheWrite} | Cache Read: ${totalCacheRead} | 캐시 히트율: ${cacheHitRate}%`);
  if (skipped > 0) console.log(`건너뛴 줄: ${skipped}`);
  console.log(`총합: Input ${totalInput} + Output ${totalOutput} = ${totalInput + totalOutput} | 출력:입력 비율 ${outputInputRatio}`);
}

main();
