import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Columns } from "../components/Columns";
import { Confirm } from "../components/Confirm";
import { Filters } from "../components/Filters";
import { SidebarMenu } from "../components/SidebarMenu";
import { TasklyModals } from "../components/TasklyModals";
import { Notifications } from "../components/Notifications";
import { getRoleLabel } from "../role/roles";

const BOARD_NAME_LIMIT = 80;

function getPriorityValue(priority) {
    if (priority === "bassa") {
        return "low";
    }

    if (priority === "media") {
        return "medium";
    }

    if (priority === "alta") {
        return "high";
    }

    return priority || "medium";
}

export function Taskly() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [boards, setBoards] = useState([]);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [boardError, setBoardError] = useState("");
    const [boardActionError, setBoardActionError] = useState("");
    const [columnError, setColumnError] = useState("");
    const [activeModal, setActiveModal] = useState("");
    const [selectedColumnId, setSelectedColumnId] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [shareMessage, setShareMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState("");
    const [memberToRemoveId, setMemberToRemoveId] = useState(null);
    const [columnToDeleteId, setColumnToDeleteId] = useState(null);
    const [menuOpen, setMenuOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    useEffect(() => {
        async function loadTaskly() {
            try {
                const [
                    userResponse,
                    boardsResponse,
                    notificationsResponse,
                ] = await Promise.all([
                    window.axios.get("/api/user"),
                    window.axios.get("/api/boards"),
                    window.axios.get("/api/notifications"),
                ]);

                setUser(userResponse.data);
                setBoards(boardsResponse.data);
                setNotifications(notificationsResponse.data);

                if (boardsResponse.data.length > 0) {
                    setSelectedBoardId(boardsResponse.data[0].id);
                }
            } catch {
                navigate("/accedi");
            }
        }

        loadTaskly();
    }, [navigate]);

    useEffect(() => {
        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    async function loadNotifications() {
        try {
            const response = await window.axios.get("/api/notifications");
            setNotifications(response.data);
        } catch {
            setNotifications([]);
        }
    }

    async function handleMarkNotificationsRead() {
        try {
            await window.axios.put("/api/notifications/read");
            await loadNotifications();
        } catch {
            return;
        }
    }

    async function handleLogout(event) {
        event.preventDefault();

        try {
            await window.axios.post("/api/logout");
        } finally {
            setUser(null);
            navigate("/");
        }
    }

    async function handleCreateBoard(event) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("boardName") || "").trim();

        if (!name) {
            return;
        }

        if (name.length > BOARD_NAME_LIMIT) {
            setBoardError(`Il nome della bacheca può avere massimo ${BOARD_NAME_LIMIT} caratteri.`);
            return;
        }

        setBoardError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post("/api/boards", { name });
            const board = response.data;

            setBoards((currentBoards) => [board, ...currentBoards]);
            setSelectedBoardId(board.id);
            form.reset();
        } catch {
            setBoardError("Non riesco a creare la bacheca. Riprova.");
        }
    }

    async function handleJoinBoard(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const invite_code = String(formData.get("invite_code") || "").trim();

        if (!invite_code) {
            return;
        }

        setBoardError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post("/api/boards/join", {
                invite_code,
            });
            const board = response.data;

            setBoards((currentBoards) => {
                const exists = currentBoards.some((item) => item.id === board.id);

                if (exists) {
                    return currentBoards.map((item) => {
                        if (item.id === board.id) {
                            return board;
                        }

                        return item;
                    });
                }

                return [board, ...currentBoards];
            });
            setSelectedBoardId(board.id);
            form.reset();
        } catch {
            setBoardError("Codice invito non valido.");
        }
    }

    const selectedBoard = boards.find((board) => board.id === selectedBoardId);
    const selectedColumns = selectedBoard?.columns || [];

    function updateBoardColumns(boardId, columns) {
        setBoards((currentBoards) =>
            currentBoards.map((board) => {
                if (board.id === boardId) {
                    return { ...board, columns };
                }

                return board;
            })
        );
    }

    function updateSelectedBoard(updatedBoard) {
        setBoards((currentBoards) =>
            currentBoards.map((board) => {
                if (board.id === updatedBoard.id) {
                    return updatedBoard;
                }

                return board;
            })
        );
    }

    async function handleUpdateBoard(event) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();
        const description = String(formData.get("description") || "").trim();
        const color = String(formData.get("color") || "#2563eb");

        if (!name) {
            return;
        }

        if (name.length > BOARD_NAME_LIMIT) {
            setBoardActionError(`Il nome della bacheca può avere massimo ${BOARD_NAME_LIMIT} caratteri.`);
            return;
        }

        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.put(`/api/boards/${selectedBoard.id}`, {
                name,
                description,
                color,
            });

            updateSelectedBoard(response.data);
            setActiveModal("");
        } catch {
            setBoardActionError("Non riesco a modificare la bacheca.");
        }
    }

    function handleDeleteBoard() {
        if (!selectedBoard) {
            return;
        }

        setConfirmAction("deleteBoard");
    }

    async function confirmDeleteBoard() {
        if (!selectedBoard) {
            return;
        }

        setConfirmAction("");
        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            await window.axios.delete(`/api/boards/${selectedBoard.id}`);
            const nextBoards = boards.filter((board) => board.id !== selectedBoard.id);

            setBoards(nextBoards);
            setSelectedBoardId(nextBoards[0]?.id || null);
            setActiveModal("");
        } catch {
            setBoardActionError("Solo il proprietario può eliminare la bacheca.");
        }
    }

    function handleLeaveBoard() {
        if (!selectedBoard) {
            return;
        }

        setConfirmAction("leaveBoard");
    }

    async function confirmLeaveBoard() {
        if (!selectedBoard) {
            return;
        }

        setConfirmAction("");
        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            await window.axios.delete(`/api/boards/${selectedBoard.id}/leave`);

            const nextBoards = boards.filter((board) => board.id !== selectedBoard.id);

            setBoards(nextBoards);
            setSelectedBoardId(nextBoards[0]?.id || null);
            setActiveModal("");
        } catch {
            setBoardActionError("Non riesco ad abbandonare la bacheca.");
        }
    }

    async function handleCreateTag(event) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("tagName") || "").trim();
        const color = String(formData.get("tagColor") || "#2563eb");

        if (!name) {
            return;
        }

        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post(
                `/api/boards/${selectedBoard.id}/tags`,
                { name, color }
            );
            const tag = response.data;

            updateSelectedBoard({
                ...selectedBoard,
                tags: [...(selectedBoard.tags || []), tag],
            });
            form.reset();
        } catch {
            setBoardActionError("Non riesco a creare il tag.");
        }
    }

    async function handleUpdateTag(event, tagId) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();
        const color = String(formData.get("color") || "#2563eb");

        if (!name) {
            return;
        }

        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.put(`/api/tags/${tagId}`, {
                name,
                color,
            });
            const updatedTag = response.data;
            const tags = (selectedBoard.tags || []).map((tag) => {
                if (tag.id === tagId) {
                    return updatedTag;
                }

                return tag;
            });

            updateSelectedBoard({ ...selectedBoard, tags });
        } catch {
            setBoardActionError("Non riesco a modificare il tag.");
        }
    }

    async function handleDeleteTag(tagId) {
        if (!selectedBoard) {
            return;
        }

        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            await window.axios.delete(`/api/tags/${tagId}`);
            const tags = (selectedBoard.tags || []).filter((tag) => tag.id !== tagId);

            updateSelectedBoard({ ...selectedBoard, tags });
        } catch {
            setBoardActionError("Non riesco a eliminare il tag.");
        }
    }

    async function handleCreateColumn(event) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("columnName") || "").trim();
        const color = String(formData.get("columnColor") || "#dbeafe");

        if (!name) {
            return;
        }

        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post(
                `/api/boards/${selectedBoard.id}/columns`,
                { name, color }
            );
            const column = response.data;

            updateBoardColumns(selectedBoard.id, [...selectedColumns, column]);
            form.reset();
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a creare la colonna. Riprova.");
        }
    }

    async function handleUpdateColumn(event, columnId) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "").trim();
        const color = String(formData.get("color") || "#dbeafe");

        if (!selectedBoard || !name) {
            return;
        }

        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.put(`/api/columns/${columnId}`, {
                name,
                color,
            });
            const updatedColumn = response.data;
            const columns = selectedColumns.map((column) => {
                if (column.id === columnId) {
                    return updatedColumn;
                }

                return column;
            });

            updateBoardColumns(selectedBoard.id, columns);
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a modificare la colonna. Riprova.");
        }
    }

    function handleDeleteColumn(columnId) {
        if (!selectedBoard) {
            return;
        }

        const column = selectedColumns.find((item) => item.id === columnId);
        const taskCount = column?.tasks?.length || 0;

        setColumnToDeleteId(columnId);
        setColumnError("");

        if (taskCount > 0) {
            setConfirmAction("deleteColumnWarning");
            return;
        }

        confirmDeleteColumn(columnId);
    }

    async function confirmDeleteColumn(columnId = columnToDeleteId) {
        if (!selectedBoard || !columnId) {
            return;
        }

        setConfirmAction("");
        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            await window.axios.delete(`/api/columns/${columnId}`);
            const columns = selectedColumns.filter((column) => column.id !== columnId);

            updateBoardColumns(selectedBoard.id, columns);
            setColumnToDeleteId(null);
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a eliminare la colonna. Riprova.");
        }
    }

    async function handleCreateTask(event, columnId) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const title = String(formData.get("taskTitle") || "").trim();
        const description = String(formData.get("description") || "").trim();
        const priority = String(formData.get("priority") || "medium");
        const tag_id = formData.get("tag_id") || null;

        if (!title || !columnId) {
            return;
        }

        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post(
                `/api/columns/${columnId}/tasks`,
                {
                    title,
                    description,
                    priority,
                    tag_id,
                }
            );
            const task = response.data;
            const columns = selectedColumns.map((column) => {
                if (column.id === columnId) {
                    const tasks = column.tasks || [];
                    return { ...column, tasks: [...tasks, task] };
                }

                return column;
            });

            updateBoardColumns(selectedBoard.id, columns);
            form.reset();
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a creare la task. Riprova.");
        }
    }

    async function handleUpdateTask(event, taskId) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const data = {
            title: String(formData.get("title") || "").trim(),
            description: String(formData.get("description") || "").trim(),
            priority: String(formData.get("priority") || "medium"),
            tag_id: formData.get("tag_id") || null,
        };

        if (!data.title) {
            return;
        }

        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.put(`/api/tasks/${taskId}`, data);
            const updatedTask = response.data;
            const columns = selectedColumns.map((column) => {
                const tasks = (column.tasks || []).map((task) => {
                    if (task.id === taskId) {
                        return updatedTask;
                    }

                    return task;
                });

                return { ...column, tasks };
            });

            updateBoardColumns(selectedBoard.id, columns);
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a modificare la task. Riprova.");
        }
    }

    async function handleDeleteTask(taskId) {
        if (!selectedBoard) {
            return;
        }

        setColumnError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            await window.axios.delete(`/api/tasks/${taskId}`);
            const columns = selectedColumns.map((column) => {
                const tasks = (column.tasks || []).filter((task) => task.id !== taskId);

                return { ...column, tasks };
            });

            updateBoardColumns(selectedBoard.id, columns);
            setActiveModal("");
        } catch {
            setColumnError("Non riesco a eliminare la task. Riprova.");
        }
    }

    function handleOpenEditColumn(columnId) {
        setSelectedColumnId(columnId);
        setColumnError("");
        setActiveModal("editColumn");
    }

    function handleOpenBoardSettings(boardId) {
        setSelectedBoardId(boardId);
        setBoardActionError("");
        setActiveModal("board");
    }

    function handleOpenEditTask(taskId) {
        setSelectedTaskId(taskId);
        setColumnError("");
        setActiveModal("editTask");
    }

    async function handleShareBoard(event) {
        event.preventDefault();

        if (!selectedBoard) {
            return;
        }

        const formData = new FormData(event.currentTarget);
        const role = String(formData.get("role") || "editor");

        setBoardActionError("");
        setShareMessage("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.post(
                `/api/boards/${selectedBoard.id}/invite`,
                { role }
            );

            updateSelectedBoard(response.data);
            setShareMessage(`Codice invito: ${response.data.invite_code} - ruolo: ${getRoleLabel(role)}`);
        } catch {
            setBoardActionError("Non riesco a generare l'invito.");
        }
    }

    async function handleUpdateMemberRole(memberId, role) {
        if (!selectedBoard) {
            return;
        }

        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.put(`/api/board-members/${memberId}`, {
                role,
            });

            updateSelectedBoard(response.data);
        } catch {
            setBoardActionError("Non riesco a modificare il ruolo.");
        }
    }

    function handleRemoveMember(memberId) {
        if (!selectedBoard) {
            return;
        }

        setMemberToRemoveId(memberId);
        setConfirmAction("removeMember");
    }

    async function confirmRemoveMember() {
        if (!selectedBoard || !memberToRemoveId) {
            return;
        }

        setConfirmAction("");
        setBoardActionError("");

        try {
            await window.axios.get("/sanctum/csrf-cookie");
            const response = await window.axios.delete(`/api/board-members/${memberToRemoveId}`);

            updateSelectedBoard(response.data);
            setMemberToRemoveId(null);
        } catch {
            setBoardActionError("Non riesco a rimuovere l'utente.");
        }
    }

    function getSelectedRole() {
        const member = (selectedBoard?.members || []).find((item) => item.user_id === user?.id);
        return member?.role || "owner";
    }

    function findSelectedTask() {
        for (const column of selectedColumns) {
            const tasks = column.tasks || [];
            const task = tasks.find((item) => item.id === selectedTaskId);

            if (task) {
                return task;
            }
        }

        return null;
    }

    function openModal(modal) {
        if (modal === "column" || modal === "task") {
            setColumnError("");
        }

        if (modal === "tag") {
            setBoardActionError("");
        }

        if (modal === "share") {
            setShareMessage("");
        }

        setActiveModal(modal);
    }

    const selectedRole = getSelectedRole();
    const canManageBoard = selectedRole === "owner" || selectedRole === "admin";
    const canEditTasks =
        selectedRole === "owner" || selectedRole === "admin" || selectedRole === "editor";
    const selectedColumn = selectedColumns.find((column) => column.id === selectedColumnId);
    const columnToDelete = selectedColumns.find((column) => column.id === columnToDeleteId);
    const columnToDeleteTaskCount = columnToDelete?.tasks?.length || 0;
    const selectedTask = findSelectedTask();
    const displayedColumns = selectedColumns.map((column) => {
        const tasks = (column.tasks || []).filter((task) => {
            const matchesSearch = task.title
                .toLowerCase()
                .includes(search.toLowerCase().trim());
            const matchesPriority =
                !priorityFilter || getPriorityValue(task.priority) === priorityFilter;
            const matchesTag = !tagFilter || String(task.tag_id || "") === tagFilter;

            return matchesSearch && matchesPriority && matchesTag;
        });

        return { ...column, tasks };
    });

    return (
        <main className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_50%,#fffaf3_100%)] text-[#101828] min-[1240px]:flex-row">
            {confirmAction === "leaveBoard" && (
                <Confirm
                    title="Abbandonare bacheca?"
                    text="Non vedrai più questa bacheca nella tua lista. Potrai rientrare solo con un nuovo codice invito."
                    confirmText="Abbandona"
                    onConfirm={confirmLeaveBoard}
                    onCancel={() => setConfirmAction("")}
                />
            )}

            {confirmAction === "deleteBoard" && (
                <Confirm
                    title="Eliminare bacheca?"
                    text="Questa azione elimina la bacheca per tutti i membri e non può essere annullata."
                    confirmText="Elimina"
                    onConfirm={confirmDeleteBoard}
                    onCancel={() => setConfirmAction("")}
                />
            )}

            {confirmAction === "removeMember" && (
                <Confirm
                    title="Rimuovere utente?"
                    text="L'utente non vedrà più questa bacheca e potrà rientrare solo con un nuovo codice invito."
                    confirmText="Rimuovi"
                    onConfirm={confirmRemoveMember}
                    onCancel={() => {
                        setConfirmAction("");
                        setMemberToRemoveId(null);
                    }}
                />
            )}

            {confirmAction === "deleteColumnWarning" && (
                <Confirm
                    title="La colonna contiene task"
                    text={`La colonna "${columnToDelete?.name || ""}" contiene ${columnToDeleteTaskCount} task. Eliminandola verranno eliminate anche tutte le task dentro questa colonna.`}
                    confirmText="Elimina"
                    onConfirm={() => confirmDeleteColumn()}
                    onCancel={() => {
                        setConfirmAction("");
                        setColumnToDeleteId(null);
                    }}
                />
            )}

            {confirmAction === "deleteColumnFirst" && (
                <Confirm
                    title="Eliminare colonna?"
                    text={`La colonna "${columnToDelete?.name || ""}" contiene ${columnToDeleteTaskCount} task. Se continui verranno eliminate anche tutte le task dentro questa colonna.`}
                    confirmText="Elimina"
                    onConfirm={() => confirmDeleteColumn()}
                    onCancel={() => {
                        setConfirmAction("");
                        setColumnToDeleteId(null);
                    }}
                />
            )}

            <aside className="flex w-full shrink-0 flex-col border-b border-[#dbe3ee] bg-white/85 px-4 py-4 sm:px-5 min-[1240px]:min-h-screen min-[1240px]:w-75 min-[1240px]:border-r min-[1240px]:border-b-0 min-[1240px]:py-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                    <Link className="inline-flex items-center gap-3" to="/taskly">
                        <img className="h-8 w-8 rounded-lg" src="/assets/taskly-logo.svg" alt="" />
                        <span className="text-xl font-extrabold">Taskly</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Notifications
                            open={notificationsOpen}
                            notifications={notifications}
                            onToggle={() => setNotificationsOpen(!notificationsOpen)}
                            onMarkRead={handleMarkNotificationsRead}
                        />

                        <button
                            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-lg bg-[#eef6ff] transition hover:bg-[#dbeafe] min-[1240px]:hidden"
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Apri o chiudi menu"
                        >
                            <span className="h-0.5 w-5 rounded-full bg-[#101828]"></span>
                            <span className="h-0.5 w-5 rounded-full bg-[#101828]"></span>
                            <span className="h-0.5 w-5 rounded-full bg-[#101828]"></span>
                        </button>
                    </div>
                </div>

                <div className={`${menuOpen ? "block" : "hidden"} min-[1240px]:block`}>
                        <section className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#d6dce5] bg-white p-3">
                            <div className="min-w-0">
                                <h2 className="mb-1 truncate text-base font-extrabold">
                                    {user?.name || "Nome utente"}
                                </h2>
                                <p className="truncate text-sm text-[#6b7280]">
                                    {user?.email || "Caricamento..."}
                                </p>
                            </div>

                            <button
                                className="shrink-0 pr-2 text-sm font-extrabold text-[#dc2626] cursor-pointer transition hover:text-[#b92f1d]"
                                type="button"
                                onClick={handleLogout}
                            >
                                Esci
                            </button>
                        </section>

                        <SidebarMenu
                            user={user}
                            boards={boards}
                            selectedBoardId={selectedBoardId}
                            boardError={boardError}
                            boardNameLimit={BOARD_NAME_LIMIT}
                            onCreateBoard={handleCreateBoard}
                            onJoinBoard={handleJoinBoard}
                            onSelectBoard={setSelectedBoardId}
                            onOpenBoardSettings={handleOpenBoardSettings}
                        />
                </div>
            </aside>

            <section className="flex min-w-0 flex-1 flex-col overflow-hidden px-4 py-5 sm:px-5 min-[1240px]:px-6 min-[1240px]:py-6">
                {!selectedBoard ? (
                    <div className="grid flex-1 place-items-center text-center">
                        <div>
                            <h1 className="mb-3 text-2xl font-extrabold">
                                Crea la tua prima bacheca
                            </h1>
                            <p className="text-base leading-6 text-[#666f7d]">
                                Usa il pannello laterale per iniziare o inserisci un codice invito.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 max-w-full">
                                <p className="mb-1 text-sm font-extrabold uppercase text-[#1d4ed8]">
                                    {getRoleLabel(selectedRole)}
                                </p>
                                <h1 className="max-w-full overflow-hidden wrap-break-word text-4xl font-extrabold leading-tight text-[#101828] sm:text-5xl sm:leading-none">
                                    {selectedBoard.name}
                                </h1>
                                <p className="mt-3 max-w-3xl text-base leading-6 text-[#475467]">
                                    {selectedBoard.description ||
                                        "Bacheca condivisibile con colonne personalizzate e tag colorati."}
                                </p>
                            </div>

                            {(canManageBoard || canEditTasks || selectedRole !== "owner") && (
                                <div className="grid w-full grid-cols-2 gap-2 text-sm sm:flex sm:w-auto sm:flex-wrap sm:text-base">
                                    {canManageBoard && (
                                        <>
                                            <button className="btn btn-light" type="button" onClick={() => openModal("column")}>
                                                 Colonna
                                            </button>
                                            <button className="btn btn-light" type="button" onClick={() => openModal("tag")}>
                                                Tag
                                            </button>
                                        </>
                                    )}
                                    {canEditTasks && (
                                        <button className="btn btn-blue" type="button" onClick={() => openModal("task")}>
                                            + Task
                                        </button>
                                    )}
                                    {canManageBoard && (
                                        <button className="btn btn-plain" type="button" onClick={() => openModal("share")}>
                                            Condividi
                                        </button>
                                    )}
                                    {selectedRole !== "owner" && (
                                        <button className="btn btn-red" type="button" onClick={handleLeaveBoard}>
                                            Abbandona
                                        </button>
                                    )}
                                </div>
                            )}
                        </header>

                        <Filters
                            tags={selectedBoard.tags || []}
                            search={search}
                            priorityFilter={priorityFilter}
                            tagFilter={tagFilter}
                            onSearchChange={setSearch}
                            onPriorityChange={setPriorityFilter}
                            onTagChange={setTagFilter}
                        />

                        <Columns
                            columns={displayedColumns}
                            canEditColumns={canManageBoard}
                            canEditTasks={canEditTasks}
                            onEditColumn={handleOpenEditColumn}
                            onEditTask={handleOpenEditTask}
                        />

                        <TasklyModals
                            activeModal={activeModal}
                            board={selectedBoard}
                            boardNameLimit={BOARD_NAME_LIMIT}
                            boardActionError={boardActionError}
                            columnError={columnError}
                            selectedColumn={selectedColumn}
                            selectedTask={selectedTask}
                            selectedColumns={selectedColumns}
                            selectedRole={selectedRole}
                            shareMessage={shareMessage}
                            onClose={() => setActiveModal("")}
                            onUpdateBoard={handleUpdateBoard}
                            onDeleteBoard={handleDeleteBoard}
                            onCreateColumn={handleCreateColumn}
                            onUpdateColumn={handleUpdateColumn}
                            onDeleteColumn={handleDeleteColumn}
                            onCreateTag={handleCreateTag}
                            onUpdateTag={handleUpdateTag}
                            onDeleteTag={handleDeleteTag}
                            onCreateTask={handleCreateTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            onShare={handleShareBoard}
                            onUpdateMemberRole={handleUpdateMemberRole}
                            onRemoveMember={handleRemoveMember}
                        />
                    </>
                )}
            </section>
        </main>
    );
}
