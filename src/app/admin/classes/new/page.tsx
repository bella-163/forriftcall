"use client";

import ClassEditorPage from "../[slug]/page";

const newClassParams = Promise.resolve({ slug: "new" });

export default function NewClassPage() {
  return <ClassEditorPage params={newClassParams} />;
}
