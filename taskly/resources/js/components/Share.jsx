import React from "react";
import { getRoleLabel } from "../role/roles";

export function Share({
    board,
    selectedRole,
    error,
    shareMessage,
    onShare,
    onUpdateMemberRole,
    onRemoveMember,
}) {
    return (
        <>
            <form className="space-y-3" onSubmit={onShare}>
                <select
                    className="select"
                    name="role"
                    defaultValue={board.invite_role || "editor"}
                >
                    <option value="admin">Amministratore</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Visualizzatore</option>
                </select>
                <button className="btn btn-blue btn-full" type="submit">
                    Genera codice
                </button>
            </form>

            {error && <p className="error mt-3">{error}</p>}

            {shareMessage && (
                <p className="mt-3 rounded-lg bg-[#eaf2ff] px-3 py-2 text-base font-extrabold text-[#176fe6]">
                    {shareMessage}
                </p>
            )}

            <div className="mt-4 space-y-2">
                {(board.members || []).map((member) => (
                    <div
                        className="flex flex-col gap-2 rounded-lg bg-[#f8fbff] px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                        key={member.id}
                    >
                        <div className="min-w-0">
                            <p className="truncate text-base font-extrabold text-[#101828]">
                                {member.user?.name || "Nome utente"}
                            </p>
                            <p className="truncate text-sm text-[#667085]">
                                {member.user?.email}
                            </p>
                        </div>
                        {member.role === "owner" || selectedRole !== "owner" ? (
                            <span className="text-base font-extrabold text-[#667085]">
                                {getRoleLabel(member.role)}
                            </span>
                        ) : (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <select
                                    className="select"
                                    value={member.role}
                                    onChange={(event) =>
                                        onUpdateMemberRole(
                                            member.id,
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="admin">
                                        Amministratore
                                    </option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">
                                        Visualizzatore
                                    </option>
                                </select>
                                <button
                                    className="btn btn-red"
                                    type="button"
                                    onClick={() => onRemoveMember(member.id)}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
