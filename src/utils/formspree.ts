export const FORMSPREE_URL = 'https://formspree.io/f/xnjlvpqn';

export async function postToFormspree(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
