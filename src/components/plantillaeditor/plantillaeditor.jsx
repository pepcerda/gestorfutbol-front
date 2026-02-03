import { useState } from "react";
import "./plantillaeditor.css";
import { Editor } from "@tinymce/tinymce-react";

const PlantillaEditor = ({ props }) => {
  return (
    <Editor
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY || ""} // o deja vacío en local
      value={props.contingutHtml || ""}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "preview",
          "help",
          "wordcount",
          "fontfamily",
          "quickbars",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "table | fontfamily | preview media | " +
          "removeformat | help | quickimage",
        font_family_formats:
          "Arial=arial,helvetica,sans-serif;" +
          "My Custom Font=my-custom-font,sans-serif",
      }}
      onEditorChange={props.onEditorChange}
    />
  );
};

export default PlantillaEditor;
