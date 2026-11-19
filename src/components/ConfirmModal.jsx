// Fenêtre de confirmation personnalisée (remplace window.confirm)
function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onCancel}>Retour</button>
                    <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
