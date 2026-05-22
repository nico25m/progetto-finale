export function getRoleLabel(role) {
    if (role === "owner") {
        return "Proprietario";
    }

    if (role === "admin") {
        return "Amministratore";
    }

    if (role === "editor") {
        return "Editor";
    }

    if (role === "viewer") {
        return "Visualizzatore";
    }

    return role;
}
