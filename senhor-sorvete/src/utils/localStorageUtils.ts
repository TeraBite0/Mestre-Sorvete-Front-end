export const saveStateToLocalStorage = (key: string, state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
};

export const loadStateFromLocalStorage = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
    return undefined;
  }
};
