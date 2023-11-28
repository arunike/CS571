import { StyleSheet, Text, View, Button, ScrollView, Modal, TextInput, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import BadgerChatMessage from '../helper/BadgerChatMessage';
import CS571 from '@cs571/mobile-client'

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const {chatroomName } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 4;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    async function getToken() {
        return await SecureStore.getItemAsync('jwt').catch(error => {
            console.error('Error storing the JWT:', error);
        });
    }

    const fetchMessages = (page) => {
        getToken().then(token => {
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${chatroomName}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': CS571.getBadgerId(),
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                return response.json();
            }).then(data => {
                if (data && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    setMessages([]);
                }
            }).catch(error => {
                console.error('API request failed:', error);
            })
        }).catch(error => {
            console.error('Error fetching token:', error);
        });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
        
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleCreatePost = () => {
        getToken().then(token => {
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${chatroomName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CS571-ID': CS571.getBadgerId(),
                },
                body: JSON.stringify({ title: postTitle, content: postContent }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }

                return response.json();
            }).then(() => {
                Alert.alert("Success", "Your post was successfully created!");
                setPostTitle('');
                setPostContent('');
                setIsModalVisible(false);
                fetchMessages(1);
                setCurrentPage(1);
            }).catch(error => {
                console.error('API request failed:', error);
            });
        });
    };

    const handleDeletePost = (postId) => {
        Alert.alert("Delete Post","Are you sure you want to delete this post?", [{text: "Cancel",style: "cancel"}, { text: "OK",
            onPress: () => {
                getToken().then(token => {
                    fetch(`https://cs571.org/api/f23/hw9/messages?id=${postId}`, {
                        method: 'DELETE',
                        headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-CS571-ID': CS571.getBadgerId(),
                        }
                    }).then(response => {
                        if (!response.ok) {
                        throw new Error('Failed to delete post');
                        }
                        return response.json();
                    }).then(() => {
                        Alert.alert("Success", "Successfully deleted the post!");
                        fetchMessages(1);
                        setCurrentPage(1);
                    }).catch(error => {
                        console.error('API request failed:', error);
                    })
                }
            );
        }}], { cancelable: false });
    };

    const fetchCurrentUser = () => {
        getToken().then(token => {
            fetch('https://cs571.org/api/f23/hw9/whoami', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CS571-ID': CS571.getBadgerId(),
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch current user');
                }

                return response.json();
            }).then(data => {
                setCurrentUser(data.user.username);
            }).catch(error => {
                console.error('API request failed:', error);
            });
        }).catch(error => {
            console.error('Error fetching token:', error);
        });
    };

    useEffect(() => {
        fetchMessages(currentPage);
    }, [chatroomName, currentPage]);

    useEffect(() => {
        if (!props.isGuest) {
            fetchCurrentUser();
        }
    }, []);

    return <View style={styles.container}>
        <ScrollView style={styles.messagesContainer}>
            {messages.length > 0 ? (
                messages.map(message => (
                    <BadgerChatMessage
                        key={message.id}
                        {...message}
                        isOwnedByUser={message.poster === currentUser}
                        onDelete={handleDeletePost}
                        />
                    ))
                    ) : (
                    <Text style={styles.emptyMessage}>There's nothing here!</Text>
                )}
        </ScrollView>
        <Text style={styles.pageIndicator}>
            You are on page {currentPage} of {totalPages}
        </Text>
        <View style={styles.paginationContainer}>
            <TouchableOpacity 
                style={[styles.previousButton, currentPage === 1 && styles.disabledButton]}
                onPress={goToPreviousPage}
                disabled={currentPage === 1}>
                <Text style={styles.buttonText}>Previous Page</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.nextButton, currentPage === totalPages && styles.disabledButton]}
                onPress={goToNextPage}
                disabled={currentPage === totalPages}>
                <Text style={styles.buttonText}>Next Page</Text>
            </TouchableOpacity>
        </View>
        {!props.isGuest && (
            <TouchableOpacity style={[styles.addPostButton]} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>Add Post</Text>
            </TouchableOpacity>
        )}
        <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Create A Post</Text>
                    <TextInput
                        placeholder="Title"
                        style={styles.modalInput}
                        value={postTitle}
                        onChangeText={setPostTitle}
                    />
                    <TextInput
                        placeholder="Body"
                        multiline
                        style={[styles.modalInput, styles.modalBodyInput]}
                        value={postContent}
                        onChangeText={setPostContent}
                    />
                    <View style={styles.modalButtonContainer}>
                        <Button
                            title="Cancel"
                            onPress={() => setIsModalVisible(false)}
                        />
                        <Button
                            title="Create Post"
                            onPress={handleCreatePost}
                            disabled={!postTitle.trim() || !postContent.trim()}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'stretch',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalBodyInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
    addPostButton: {
        alignItems: "center",
        backgroundColor: "#f44336",
        padding: 10,
        width: '100%',
    },
    previousButton: {
        alignItems: "center",
        backgroundColor: "#04AA6D",
        padding: 10,
        width: '60%',
    },
    nextButton: {
        alignItems: "center",
        backgroundColor: "#008CBA",
        padding: 10,
        width: '60%',
    },
    buttonText: {
        color: "white",
        fontSize: 16
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    }
});

export default BadgerChatroomScreen;