import React from "react";
import CustomButton from "./CustomButton";
import { useSnapshot } from "valtio";
import state from "../store";
import { getContrastingColor } from "../config/helpers";

const FilePicker = ({ file, setfile, readFile }) => {
  const snap = useSnapshot(state);
  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />
        <label
          htmlFor="file-upload"
          className={"filepicker-label"}
          style={{
            backgroundColor: snap.color,
            color: getContrastingColor(snap.color),
          }}
        >
          Upload File
        </label>
        <p
          className="mt-2 text-gray-500 text-xs truncate"
          style={{ color: getContrastingColor(snap.color) }}
        >
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type={"outline"}
          title={"Logo"}
          handleClick={() => file && readFile("logo")}
          customStyles={"text-xs"}
        />
        <CustomButton
          type={"filled"}
          title={"Full"}
          handleClick={() => file && readFile("full")}
          customStyles={"text-xs"}
        />
      </div>
    </div>
  );
};

export default FilePicker;
