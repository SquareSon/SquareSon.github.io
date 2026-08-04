import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 · COORDINATE NOT FOUND</p>
      <h1>这条路径不在当前坐标系中。</h1>
      <span>This path is outside the current coordinate frame.</span>
      <Link href="/">返回主页 · Return home</Link>
    </main>
  );
}
