import React, { useEffect, useState } from "react";
import { ComponentDropdown, ComponentSetting } from "../../types/Types";

const CloseIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

const mapValuesToDisplay = (button: ComponentSetting, values: string[]) => {
  const tags: ComponentDropdown[] = [];

  values.forEach((v) => {
    if (button.dropdown == null) {
      tags.push({ display: v, value: v });
      return;
    }

    const drop = button.dropdown.find(
      (d) => d.value.toLowerCase() == v.toLowerCase()
    );

    if (drop == null) {
      tags.push({ display: v, value: v });
      return;
    }

    tags.push(drop);
  });

  return tags;
};

const TagsInput = ({ button }: { button: ComponentSetting }) => {
  const [tags, setTags] = React.useState(
    mapValuesToDisplay(
      button,
      button.value.split(button.tagsSeperator).filter((s) => s.length > 0)
    )
  );

  const addTag = (tag: ComponentDropdown) => {
    setSearchValue("");
    setTags([...tags, tag]);

    const vals = button.value
      .split(button.tagsSeperator)
      .filter((s) => s.length > 0);
    vals.push(tag.value);

    button.setValue(vals.join(button.tagsSeperator));
  };

  // Add or remove tags by using the key
  const handleTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value !== "") {
      const dropdownValue =
        button.dropdown != null
          ? button.dropdown.find(
              (d) =>
                d.display.toLowerCase() ==
                event.currentTarget.value.toLowerCase()
            )
          : null;

      if (button.dropdown != null && dropdownValue == null) {
        return;
      }

      const val =
        dropdownValue != null ? dropdownValue.value : event.currentTarget.value;

      if (!button.allowDuplicateTags) {
        if (
          button.value
            .split(button.tagsSeperator)
            .find((d) => d.toLowerCase() == val.toLowerCase()) != null
        ) {
          return;
        }
      }

      addTag(
        dropdownValue != null ? dropdownValue : { display: val, value: val }
      );
    } else if (
      event.key === "Backspace" &&
      tags.length &&
      event.currentTarget.value.length == 0
    ) {
      setSearchValue(tags[tags.length - 1].display);

      const tagsCopy = [...tags];
      tagsCopy.pop();
      event.preventDefault();
      setTags(tagsCopy);

      const vals = button.value
        .split(button.tagsSeperator)
        .filter((s) => s.length > 0);
      vals.pop();
      button.setValue(vals.join(button.tagsSeperator));
    }
  };

  //Remove tags by clicking the cross sign
  const removeTags = (index: number) => {
    setLastInserted(-1);
    setTags([...tags.filter((tag, ind) => ind !== index)]);

    const vals = button.value
      .split(button.tagsSeperator)
      .filter((s) => s.length > 0)
      .filter((v, ind) => ind !== index);

    button.setValue(vals.join(button.tagsSeperator));
  };

  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = React.createRef<HTMLInputElement>();
  const searchContainerRef = React.createRef<HTMLInputElement>();
  const inputRef = React.createRef<HTMLDivElement>();
  const [insertIndexAt, setInsertIndexAt] = useState(-1);
  const [draggedItem, setDraggedItem] = useState(-1);
  const [lastInserted, setLastInserted] = useState(-1);
  const [draggedWidth, setDraggedWidth] = useState(0);
  const [draggedHeight, setDraggedHeight] = useState(0);

  useEffect(() => {
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  const onAddTag = (option: ComponentDropdown) => {
    if (
      !button.allowDuplicateTags &&
      tags.find((t) => {
        t.value == option.value;
      })
    ) {
      return;
    }

    addTag(option);

    if (searchRef.current != document.activeElement) {
      setShowMenu(false);
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getOptions: () => ComponentDropdown[] = () => {
    const opts: ComponentDropdown[] = button.allowDuplicateTags
      ? button.dropdown
      : button.dropdown.filter((d) => !tags.includes(d));

    if (!searchValue) {
      return opts;
    }

    return opts.filter(
      (option) =>
        option.display.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  const dropdownFocusHandler = () => {
    if (searchContainerRef.current == null) {
      return;
    }

    if (!(document.activeElement instanceof Node)) {
      return;
    }

    if (searchContainerRef.current.contains(document.activeElement)) {
      return;
    }

    setShowMenu(false);
  };

  useEffect(() => {
    window.addEventListener("click", () => dropdownFocusHandler());

    return () => {
      window.removeEventListener("click", () => dropdownFocusHandler());
    };
  });

  const updateIndexInsert = (e: React.DragEvent) => {
    if (inputRef.current == null) {
      return;
    }

    const tag = e.currentTarget;
    let tagId = +(tag.getAttribute("data-key") ?? -10);

    const b = (
      tag.querySelector(".settingTagSingle") as Element
    ).getBoundingClientRect();
    const offset = e.clientX - (b.left + b.width / 2);

    if (offset >= 0) {
      tagId++;
    }

    setInsertIndexAt(tagId);
  };

  const dragEnd = () => {
    if (draggedItem == -1) {
      return;
    }

    if (insertIndexAt - 1 != draggedItem && insertIndexAt != draggedItem) {
      const newIndex = insertIndexAt;
      const newTags = [...tags];
      newTags.splice(draggedItem, 1);
      newTags.splice(
        newIndex - (draggedItem < newIndex ? 1 : 0),
        0,
        tags[draggedItem]
      );

      setTags(newTags);
      setLastInserted(newIndex - (draggedItem < newIndex ? 1 : 0));
    } else {
      setLastInserted(-1);
    }

    setDraggedItem(-1);
    setInsertIndexAt(-1);
  };

  const stringToColour = (str: string) => {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = "#";

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += ("00" + value.toString(16)).substr(-2);
    }

    return colour;
  };

  return (
    <div className="settingTag" ref={inputRef}>
      {tags.map((tag, index) => (
        <React.Fragment key={`${tag.display} ${tag.value} ${index}`}>
          {draggedItem >= 0 &&
          index == 0 &&
          index == insertIndexAt &&
          insertIndexAt != draggedItem &&
          draggedItem != insertIndexAt - 1 ? (
            <div
              className="hintTagDrop"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              style={{
                width: draggedWidth + "px",
                height: draggedHeight + "px"
              }}
            />
          ) : (
            <></>
          )}
          {draggedItem == index ? (
            <div
              className="hintTagDrop hintTagDropOriginal"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              style={{
                width: draggedWidth + "px",
                height: draggedHeight + "px",
                display:
                  insertIndexAt == index || insertIndexAt - 1 == index
                    ? "inline"
                    : "none"
              }}
            />
          ) : (
            <></>
          )}
          <div
            draggable
            onDragStart={(e) => {
              const ind = index;
              const wid = e.currentTarget.getBoundingClientRect().width - 10;
              const height = e.currentTarget.getBoundingClientRect().height - 2;

              setTimeout(() => {
                setInsertIndexAt(ind);
                setDraggedItem(ind);
                setDraggedWidth(wid);
                setDraggedHeight(height);
              });
            }}
            onDragEnd={() => {
              dragEnd();
            }}
            onDragOver={(e) => {
              e.preventDefault();

              updateIndexInsert(e);
            }}
            data-key={index}
            className={"tagContainer" + (draggedItem == index ? " hidden" : "")}
          >
            <div
              className={
                "settingTagSingle" +
                (index == draggedItem ? " draggedItem" : "") +
                (lastInserted == index ? " rearrangedTag" : "")
              }
              style={{
                backgroundColor: `${stringToColour(
                  `${tag.display} ${tag.value}`
                )}22`
              }}
            >
              <span>{tag.display}</span>
              <div
                className="settingTagClose"
                onClick={() => removeTags(index)}
              >
                <CloseIcon />
              </div>
            </div>
          </div>
          {draggedItem >= 0 &&
          index + 1 == insertIndexAt &&
          draggedItem + 1 != insertIndexAt &&
          draggedItem != insertIndexAt ? (
            <div
              className="hintTagDrop"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              style={{
                width: draggedWidth + "px",
                height: draggedHeight + "px"
              }}
            />
          ) : (
            <></>
          )}
        </React.Fragment>
      ))}
      <div
        ref={searchContainerRef}
        className={
          "settingTagInput" +
          (button.maxTags && tags.length >= parseInt(button.maxTags)
            ? " hidden"
            : "")
        }
      >
        <div>
          <input
            type="text"
            onChange={onSearch}
            placeholder={button.placeholderText ? button.placeholderText : ""}
            value={searchValue}
            ref={searchRef}
            onFocus={() => setShowMenu(true)}
            onKeyDown={(event) => handleTags(event)}
            size={10}
          />
        </div>

        {button.dropdown == null ? (
          <></>
        ) : (
          <>
            {showMenu && getOptions().length > 0 && (
              <div className="dropdownMenu">
                {getOptions().map((option, index) => (
                  <div
                    key={index}
                    onClick={() => onAddTag(option)}
                    className={`dropdownItem`}
                  >
                    {option.display}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TagsInput;
