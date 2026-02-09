import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types'; // For prop types validation
import {Picker} from '@react-native-picker/picker';
import { useTheme } from '../constants/ThemeContext';

const Dropdown = ({
  items,
  selectedValue,
  onValueChange,
  placeholder,
  containerStyle,
  labelStyle,
  pickerStyle,
}) => {
  const theme = useTheme();
  console.log('Theme:', theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {placeholder && (
        <Text style={[styles.label, labelStyle]}>{placeholder}</Text>
      )}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={[styles.picker, pickerStyle, {color: theme.theme === 'dark' ? '#fff' : '#000',}]}
          dropdownIconColor={ theme.theme === 'dark' ? '#fff' : '#21AFF0'}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

// Prop Types validation
Dropdown.propTypes = {
  items: PropTypes.array.isRequired,
  selectedValue: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  pickerStyle: PropTypes.object,
};

// Default props for optional styles
Dropdown.defaultProps = {
  placeholder: '',
  containerStyle: {},
  labelStyle: {},
  pickerStyle: {},
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderWidth:2,
    borderRadius:10,
    borderColor: '#55CBF5',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  pickerContainer: {
    // borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Dropdown;
