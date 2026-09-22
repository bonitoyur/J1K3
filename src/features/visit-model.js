export function today() {
  // Match the database's Asia/Seoul date rule, including visitors abroad.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

export function validateVisit({ visited_on, author, comment }) {
  const date = new Date(`${visited_on}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visited_on) || Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== visited_on || visited_on > today()) {
    return '오늘까지의 올바른 방문 날짜를 입력해 주세요.';
  }
  if (!author.trim() || author.length > 40 || !comment.trim() || comment.length > 2000) {
    return '작성자(1~40자)와 코멘트(1~2,000자)를 입력해 주세요.';
  }
  return '';
}
