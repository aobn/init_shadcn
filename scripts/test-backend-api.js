#!/usr/bin/env node

/**
 * 后端API连接测试脚本
 * 用于验证前端项目与后端API的连接状态
 */

const axios = require('axios')

// 配置
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api'
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
}

console.log('🚀 开始测试后端API连接...\n')

async function testBackendConnection() {
  console.log('📡 测试后端服务器连接状态...')
  
  try {
    // 测试基础连接
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    })
    
    console.log('✅ 后端服务器连接成功')
    console.log(`   状态码: ${response.status}`)
    console.log(`   响应: ${JSON.stringify(response.data, null, 2)}`)
    return true
  } catch (error) {
    console.log('❌ 后端服务器连接失败')
    console.log(`   错误: ${error.message}`)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   建议: 请确保后端服务已启动在 http://localhost:8080')
    }
    return false
  }
}

async function testLoginAPI() {
  console.log('\n🔐 测试管理员登录接口...')
  
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, TEST_CREDENTIALS, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })
    
    console.log('✅ 登录接口测试成功')
    console.log(`   状态码: ${response.status}`)
    console.log(`   响应格式: ${JSON.stringify(response.data, null, 2)}`)
    
    // 验证响应格式
    const { data } = response
    if (data.code === 200 && data.data && data.data.token) {
      console.log('✅ 响应格式符合规范')
      console.log(`   Token: ${data.data.token.substring(0, 20)}...`)
      return data.data.token
    } else {
      console.log('⚠️  响应格式可能不符合预期')
      return null
    }
  } catch (error) {
    console.log('❌ 登录接口测试失败')
    console.log(`   错误: ${error.message}`)
    
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`)
      console.log(`   响应: ${JSON.stringify(error.response.data, null, 2)}`)
    }
    return null
  }
}

async function testAuthenticatedAPI(token) {
  if (!token) {
    console.log('\n⏭️  跳过认证接口测试（无有效token）')
    return
  }
  
  console.log('\n🛡️  测试认证接口...')
  
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    })
    
    console.log('✅ 认证接口测试成功')
    console.log(`   状态码: ${response.status}`)
    console.log(`   管理员信息: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    console.log('❌ 认证接口测试失败')
    console.log(`   错误: ${error.message}`)
    
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`)
      if (error.response.status === 401) {
        console.log('   说明: Token可能无效或已过期')
      }
    }
  }
}

async function main() {
  console.log(`🎯 API基础URL: ${API_BASE_URL}`)
  console.log(`🔑 测试账号: ${TEST_CREDENTIALS.username}/${TEST_CREDENTIALS.password}\n`)
  
  // 1. 测试后端连接
  const isConnected = await testBackendConnection()
  
  if (!isConnected) {
    console.log('\n❌ 后端服务器无法连接，请检查：')
    console.log('   1. 后端服务是否已启动')
    console.log('   2. 端口配置是否正确 (默认8080)')
    console.log('   3. 防火墙设置是否允许连接')
    console.log('   4. API基础URL是否正确')
    process.exit(1)
  }
  
  // 2. 测试登录接口
  const token = await testLoginAPI()
  
  // 3. 测试认证接口
  await testAuthenticatedAPI(token)
  
  console.log('\n🎉 API测试完成！')
  
  if (token) {
    console.log('\n✅ 所有测试通过，后端API对接正常')
    console.log('   前端项目可以正常与后端通信')
  } else {
    console.log('\n⚠️  部分测试失败，请检查后端API实现')
    console.log('   建议对照接口文档验证后端实现')
  }
}

// 运行测试
main().catch(error => {
  console.error('\n💥 测试过程中发生未预期错误:')
  console.error(error)
  process.exit(1)
})