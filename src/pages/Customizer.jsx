import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  CustomButton,
  Tab,
  AIPicker,
  ColorPicker,
  FilePicker,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setfile] = useState("");
  const [prompt, setprompt] = useState("");
  const [generatingImg, setgeneratingImg] = useState(false);
  const [activeEditorTab, setactiveEditorTab] = useState("");
  const [activeFilterTab, setactiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.FilterTab]) {
      handleActiveFilterTab(decalType.FilterTab);
    }
  };
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true;
        break;
    }
    setactiveFilterTab((prev) => ({ ...prev, [tabName]: !prev[tabName] }));
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setactiveEditorTab("");
    });
  };

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setfile={setfile} readFile={readFile} />;
      case "aipicker":
        return <AIPicker />;
      default:
        return;
    }
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key={"custom"}
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="tabs editortabs-container">
                {EditorTabs.map((tab, key) => {
                  return (
                    <Tab
                      key={key}
                      tab={tab}
                      handleClick={() => setactiveEditorTab(tab.name)}
                    />
                  );
                })}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              customStyles={"w-fit px-4 py-2.5 font-bold text-sm"}
              handleClick={() => (state.intro = true)}
              title={"Go Back"}
              type={"filled"}
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab, key) => {
              return (
                <Tab
                  key={key}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => {
                    handleActiveFilterTab(tab.name);
                  }}
                />
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
