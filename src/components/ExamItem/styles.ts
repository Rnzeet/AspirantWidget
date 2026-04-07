import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 6,
  },
  container: {
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examInfoContainer: {
    flex: 1,
    marginRight: 12,
  },
  examName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  examDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  examDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  countdownBox: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
    justifyContent: 'center',
  },
  urgencyEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  countdownDays: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  countdownLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  countdownHours: {
    fontSize: 10,
    color: '#fff',
    marginTop: 2,
  },
  alertMessage: {
    backgroundColor: '#f0f4ff',
    color: '#2c3e50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  streakContainer: {
    backgroundColor: '#fff3cd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#856404',
  },
  targetsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  targetsList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  targetItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  targetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  targetCheckmark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#999',
    marginRight: 10,
    minWidth: 20,
  },
  completed: {
    color: '#4CAF50',
  },
  targetText: {
    flex: 1,
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  targetCompleted: {
    color: '#adb5bd',
    textDecorationLine: 'line-through',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 4,
  },
  timerText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
  },
  addTargetContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    alignItems: 'center',
  },
  addTargetInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color:"black"
  },
  addTargetButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addTargetButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  deleteTargetButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#ffebee',
  },
  motivationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    backgroundColor: '#e8f5e9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  deleteText: {
    color: '#F44336',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color:"red"
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"red"
  }
});
