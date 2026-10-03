export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
const MINUTE=60*1000,DAY=24*60*MINUTE;
const validDate=value=>typeof value==='string'&&Number.isFinite(Date.parse(value))?value:null;
function inferLastReview(record){
 if(!validDate(record.nextReviewAt)||!['correct','incorrect'].includes(record.lastResult))return null;
 const delay=record.lastResult==='incorrect'?10*MINUTE:REVIEW_INTERVALS_DAYS[Math.max(0,Math.min((record.streak||1)-1,4))]*DAY;
 return new Date(Date.parse(record.nextReviewAt)-delay).toISOString();
}
export function normalizeLearning(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 return Object.fromEntries(Object.entries(value).filter(([id,r])=>typeof id==='string'&&r&&typeof r==='object'&&!Array.isArray(r)).map(([id,r])=>[id,{
  viewedAt:validDate(r.viewedAt),
  streak:Number.isInteger(r.streak)&&r.streak>=0?Math.min(r.streak,REVIEW_INTERVALS_DAYS.length):0,
  nextReviewAt:validDate(r.nextReviewAt)||(validDate(r.viewedAt)?new Date(Date.parse(r.viewedAt)+DAY).toISOString():null),
  lastResult:['correct','incorrect'].includes(r.lastResult)?r.lastResult:null,
  lastReviewedAt:validDate(r.lastReviewedAt)||inferLastReview(r),
  attempts:Number.isInteger(r.attempts)?Math.max(0,Math.min(r.attempts,100000)):0
 }]));
}
export function markViewed(learning,id,now=Date.now()){
 const normalized=normalizeLearning(learning),previous=normalized[id]||{streak:0,lastResult:null,lastReviewedAt:null,attempts:0};
 const viewedAt=previous.viewedAt||new Date(now).toISOString();
 return {...normalized,[id]:{...previous,viewedAt,nextReviewAt:previous.nextReviewAt||new Date(Date.parse(viewedAt)+DAY).toISOString()}};
}
export function recordReview(learning,id,correct,now=Date.now(),{assisted=false}={}){
 const normalized=normalizeLearning(learning),previous=normalized[id]||{viewedAt:null,streak:0,nextReviewAt:null,lastResult:null,lastReviewedAt:null,attempts:0};
 const eligible=!previous.lastReviewedAt||!previous.nextReviewAt||Date.parse(previous.nextReviewAt)<=now;
 const advance=correct&&!assisted&&eligible;
 const streak=correct?(advance?Math.min(previous.streak+1,REVIEW_INTERVALS_DAYS.length):previous.streak):0;
 const retry=now+10*MINUTE,previousDue=Date.parse(previous.nextReviewAt),earliestRetry=Math.min(Number.isFinite(previousDue)&&previousDue>now?previousDue:Infinity,retry);
 const nextReviewAt=advance?new Date(now+REVIEW_INTERVALS_DAYS[streak-1]*DAY).toISOString():!correct||assisted?new Date(earliestRetry).toISOString():previous.nextReviewAt||new Date(retry).toISOString();
 return {...normalized,[id]:{viewedAt:previous.viewedAt||new Date(now).toISOString(),streak,nextReviewAt,lastResult:correct?'correct':'incorrect',lastReviewedAt:advance||!correct||assisted?new Date(now).toISOString():previous.lastReviewedAt,attempts:Math.min(previous.attempts+1,100000)}};
}
export function reviewStatus(record,now=Date.now()){
 if(!record?.viewedAt)return '新词';
 if(!record.nextReviewAt)return '已浏览';
 const due=Date.parse(record.nextReviewAt);if(Number.isNaN(due))return '已浏览';
 return due<=now?'待复习':record.lastResult==='incorrect'?'稍后复习':'已安排复习';
}
