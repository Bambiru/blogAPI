import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<{ ID: number; NAME: string; EMAIL: string }[]>([]);
  const [editID, setEditID] = useState<number | null>(null); // 수정 중인 항목의 ID를 관리하는 상태
  const [editValues, setEditValues] = useState<{ NAME: string; EMAIL: string }>({ NAME: "", EMAIL: "" });

  useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      });
  }, [data]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;

    fetch("http://localhost:4000/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((newData) => {
        setData((prevData) => [...prevData, newData]);
        (document.getElementById("name") as HTMLInputElement).value = "";
        (document.getElementById("email") as HTMLInputElement).value = "";
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  }

  function handleClickUpdate(item: { ID: number; NAME: string; EMAIL: string }) {
    // 편집 상태로 전환
    setEditID(item.ID);
    setEditValues({ NAME: item.NAME, EMAIL: item.EMAIL });
  }

  function handleSaveUpdate(item: { ID: number }) {
    const { ID } = item;
    const { NAME, EMAIL } = editValues;

    fetch(`http://localhost:4000/api/update/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ NAME, EMAIL }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((updateData) => {
        setData((prevData) => prevData.map((item) => (item.ID === updateData.ID ? updateData : item)));
        setEditID(null); // 수정이 완료되면 편집 상태 해제
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  }

  function handleClickDelete(item: { ID: number }) {
    const { ID } = item;

    fetch(`http://localhost:4000/api/delete/${ID}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((deleteData) => {
        setData((prevData) => prevData.filter((item) => item.ID !== deleteData.ID));
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  }

  return (
    <>
      <h1>USERS</h1>
      <div>
        {data?.map((item, index) => (
          <ul key={`${item.ID}-${index}`}>
            <li>{item.ID}</li>

            {/* 수정 중인 항목일 때는 input을 보여줌 */}
            {editID === item.ID ? (
              <>
                <li>
                  <input
                    type="text"
                    value={editValues.NAME}
                    required
                    onChange={(e) => setEditValues({ ...editValues, NAME: e.target.value })}
                  />
                </li>
                <li>
                  <input
                    type="email"
                    value={editValues.EMAIL}
                    required
                    onChange={(e) => setEditValues({ ...editValues, EMAIL: e.target.value })}
                  />
                </li>
                <li>
                  <button onClick={() => handleSaveUpdate(item)}>Save</button>
                  <button onClick={() => setEditID(null)}>Cancel</button>
                </li>
              </>
            ) : (
              <>
                <li>{item.NAME}</li>
                <li>{item.EMAIL}</li>
                <li>
                  <button onClick={() => handleClickUpdate(item)}>Update</button>
                  <button onClick={() => handleClickDelete(item)}>Delete</button>
                </li>
              </>
            )}
          </ul>
        ))}

        <form method="post" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">이름 </label>
            <input type="text" name="name" id="name" />
          </div>
          <div>
            <label htmlFor="email">이메일 </label>
            <input type="email" name="email" id="email" />
          </div>
          <button type="submit">Add</button>
        </form>
      </div>
    </>
  );
}

export default App;
