import { CategoryTiles } from "@/components/experience/home";
import { SearchBox } from "@/components/experience/shared";
export default function CategoriesPage() {
  return (
    <div className="wrap page-section category-page">
      <div className="page-intro">
        <p className="eyebrow">A LITTLE EVERY DAY</p>
        <h1>Find your kind of better.</h1>
        <p>
          From your morning ritual to the things you wear. Start with a corner
          of your everyday, and discover the story behind it.
        </p>
      </div>
      <CategoryTiles />
      <div style={{ maxWidth: 600, margin: "65px auto 0" }}>
        <SearchBox />
      </div>
    </div>
  );
}
