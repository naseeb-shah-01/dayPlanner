// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTodo = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  // Load todos from AsyncStorage on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Function to load todos from AsyncStorage
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos !== null) {
        console.log("todos: ",storedTodos)
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      Alert.alert('Error loading todos');
    }
  };

  // Function to add a new todo
  const addTodo = async () => {
    if (todo.trim() === '') {
      Alert.alert('Todo cannot be empty');
      return;
    }

    const newTodos = [...todos, { id: Date.now().toString(), text: todo }];
    setTodos(newTodos);
    setTodo('');

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      Alert.alert('Error saving todo');
    }
  };

  // Function to remove a todo
  const removeTodo = async (id) => {
    const filteredTodos = todos.filter((item) => item.id !== id);
    setTodos(filteredTodos);

    // Update AsyncStorage
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(filteredTodos));
    } catch (error) {
      Alert.alert('Error removing todo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new todo"
        value={todo}
        onChangeText={setTodo}
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.text}</Text>
            <Button title="Delete" onPress={() => removeTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

export default AddTodo;
