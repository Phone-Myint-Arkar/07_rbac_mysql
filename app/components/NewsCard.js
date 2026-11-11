import Link from "next/link";

// NewsCard — shows one news post, with Edit and Delete buttons per the permissions passed in
export default function NewsCard({ item, canEdit, canDelete, onDelete }) {
  return (
    <div className="news-card">
      <img
        src={`/news/${item.id}.png`}
        alt={item.title}
        // hide the image if this id has no file, e.g. a newly posted item
        onError={(event) => (event.currentTarget.style.display = "none")}
      />
      <div>
        <h2>{item.title}</h2>
        <p>
          <span className="category">{item.category}</span>{" "}
          {new Date(item.created_at).toLocaleDateString("en-GB")}
        </p>
        <p>{item.content}</p>
        {canEdit && <Link href={`/news/${item.id}/edit`}>Edit</Link>}{" "}
        {canDelete && <button onClick={() => onDelete(item.id)}>Delete</button>}
      </div>
    </div>
  );
}