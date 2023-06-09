import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useState } from 'react'
import { addPost } from '../../actions/post'

const PostForm = ({addPost}) => {
  const [text,setText]=useState('')
  return (
    <div  className='container'>
    
    
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-3' value='Submit' />
      </form>
      
    </div>
  );
};

PostForm.propTypes = {
  addPost:PropTypes.func.isRequired,
}

export default connect (null,{addPost})(PostForm)