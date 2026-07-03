import React, { useState } from "react";
import { useMyContext, type FileInfoType } from "../provider/MyContext";
import { useToast } from "../hooks/useToast";
import { getOrigin } from "../utils";

const FilesPage = () => {
  const { filesArr, socket } = useMyContext();
  const { showToast, Toast } = useToast();
  const [selectedFilesArr, setselectedFilesArr] = useState<File[]>([]);
  const [progressValue, setProgressValue] = useState(0);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    let filesArr = Array.from(e.target.files || []);
    // filesArr = filesArr.filter((f, _i) => f.type !== "");
    // console.log({ filesArr });

    setselectedFilesArr(filesArr);
  };

  const handleSendFiles = async () => {
    if (selectedFilesArr.length === 0) {
      showToast("No files selected!!");
      return false;
    }
    if (selectedFilesArr.length >= 10) {
      showToast("Too many files. Limit is 10.");
      return false;
    }
    const formData = new FormData();
    for (const single_file of selectedFilesArr) {
      formData.append("file", single_file);
    }
    let hasLargeFile = false;
    for (let i = 0; i < selectedFilesArr.length; i++) {
      if (selectedFilesArr[i].size > 1024 * 1024 * 10) {
        // larger than 10MB
        hasLargeFile = true;
        break;
      }
    }
    if (hasLargeFile && socket) {
      // for large file use xhr method to show progress
      xhrFileUpload(formData, (files) => {
        // on file upload success:
        showToast("Files uploaded successfully");
        setselectedFilesArr([]);
        socket.emit("my_files", {
          files,
        });
        setTimeout(() => {
          setProgressValue(0);
        }, 1000);
      });
      return false;
    }

    // for small size files instant transfer:
    try {
      let url = await getOrigin();
      const res = await fetch(`${url}/upload-file`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        showToast(error ? error : "Something went wrong!!");
        return false;
      }
      const { files } = await res.json();
      showToast("Files transfered successfully");
      setselectedFilesArr([]);
      if (!socket) return;
      socket.emit("my_files", {
        files,
      });
      setTimeout(() => {
        setProgressValue(0);
      }, 1000);
    } catch (error) {
      console.log("ERROR IN FILE UPLOAD:", error);
      showToast("ERROR IN FILE UPLOAD");
      setProgressValue(0);
    }
  };

  const xhrFileUpload = (
    formData: FormData,
    callback: (f: FileInfoType[]) => void
  ) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgressValue(percentCompleted);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const { files } = JSON.parse(xhr.response);
        callback(files);
      } else {
        showToast("File upload failed!");
      }
    };
    getOrigin().then((url) => {
      xhr.open("POST", `${url}/upload-file`, true);
      xhr.send(formData);
    });
  };

  return (
    <div>
      <div className="medium" style={{ minHeight: "87vh" }}>
        <div>
          <div className="row scroll">
            <i className="extra ">files</i>
            <p style={{ fontSize: "24px" }}>Files</p>
            <div className="max"></div>
            <div>
              <button>
                <i>attach_file</i>
                <span>
                  {selectedFilesArr.length > 0
                    ? `[${selectedFilesArr.length}] selected`
                    : "Select a File"}
                </span>
              </button>
              <input
                type="file"
                multiple={true}
                accept="*/*"
                name="file"
                id="fileInput"
                onChange={handleFileChange}
              />
            </div>
            <button onClick={handleSendFiles}>
              <i>send</i>Send {progressValue ? `${progressValue}%` : ""}
            </button>
          </div>
          <progress
            value={progressValue}
            max="100"
            className={`${
              progressValue > 0 && progressValue <= 100
                ? "tw:opacity-100"
                : "tw:opacity-0"
            }`}
          ></progress>

          {/* empty shell */}
          {filesArr.length <= 0 ? (
            <ShellView />
          ) : (
            <>
              <div className="grid">
                {filesArr.map((f, i) => (
                  <article key={i} className=" s6 m4 fill">
                    <div
                      style={{
                        flex: " 1 1 0%",
                      }}
                    >
                      <div className="max">
                        <div>{f.fileName}</div>
                      </div>
                    </div>
                    <nav>
                      <button
                        className="responsive"
                        onClick={async () => {
                          const origin = await getOrigin();
                          window.open(
                            `${origin}/download/${f.srcName}`,
                            "_blank"
                          );
                        }}
                      >
                        Dowonload
                      </button>
                    </nav>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default FilesPage;

const ShellView = () => {
  return (
    <div>
      <article
        id="file_page_content"
        className="medium middle-align center-align"
      >
        <div>
          <i className="extra">files</i>
          <h5>You have no shared files</h5>
          <p>Select a file to start sharing</p>
          <div className="space"></div>
        </div>
      </article>
    </div>
  );
};
