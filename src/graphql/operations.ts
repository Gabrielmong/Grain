import { gql } from '@apollo/client';

// LUMBER OPERATIONS
export const GET_LUMBERS = gql`
  query GetLumbers($includeDeleted: Boolean) {
    lumbers(includeDeleted: $includeDeleted) {
      id
      name
      description
      jankaRating
      costPerBoardFoot
      tags
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const GET_LUMBER = gql`
  query GetLumber($id: ID!) {
    lumber(id: $id) {
      id
      name
      description
      jankaRating
      costPerBoardFoot
      tags
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_LUMBER = gql`
  mutation CreateLumber($input: CreateLumberInput!) {
    createLumber(input: $input) {
      id
      name
      description
      jankaRating
      costPerBoardFoot
      tags
      createdAt
    }
  }
`;

export const UPDATE_LUMBER = gql`
  mutation UpdateLumber($id: ID!, $input: UpdateLumberInput!) {
    updateLumber(id: $id, input: $input) {
      id
      name
      description
      jankaRating
      costPerBoardFoot
      tags
      updatedAt
    }
  }
`;

export const DELETE_LUMBER = gql`
  mutation DeleteLumber($id: ID!) {
    deleteLumber(id: $id) {
      id
      isDeleted
    }
  }
`;

export const RESTORE_LUMBER = gql`
  mutation RestoreLumber($id: ID!) {
    restoreLumber(id: $id) {
      id
      isDeleted
    }
  }
`;

// FINISH OPERATIONS
export const GET_FINISHES = gql`
  query GetFinishes($includeDeleted: Boolean) {
    finishes(includeDeleted: $includeDeleted) {
      id
      name
      description
      price
      tags
      storeLink
      imageData
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const GET_FINISH = gql`
  query GetFinish($id: ID!) {
    finish(id: $id) {
      id
      name
      description
      price
      tags
      storeLink
      imageData
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FINISH = gql`
  mutation CreateFinish($input: CreateFinishInput!) {
    createFinish(input: $input) {
      id
      name
      description
      price
      tags
      storeLink
      imageData
      createdAt
    }
  }
`;

export const UPDATE_FINISH = gql`
  mutation UpdateFinish($id: ID!, $input: UpdateFinishInput!) {
    updateFinish(id: $id, input: $input) {
      id
      name
      description
      price
      tags
      storeLink
      imageData
      updatedAt
    }
  }
`;

export const DELETE_FINISH = gql`
  mutation DeleteFinish($id: ID!) {
    deleteFinish(id: $id) {
      id
      isDeleted
    }
  }
`;

export const RESTORE_FINISH = gql`
  mutation RestoreFinish($id: ID!) {
    restoreFinish(id: $id) {
      id
      isDeleted
    }
  }
`;

// TOOL OPERATIONS
export const GET_TOOLS = gql`
  query GetTools($includeDeleted: Boolean) {
    tools(includeDeleted: $includeDeleted) {
      id
      name
      description
      function
      price
      serialNumber
      imageData
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const GET_TOOL = gql`
  query GetTool($id: ID!) {
    tool(id: $id) {
      id
      name
      description
      function
      price
      serialNumber
      imageData
      isDeleted
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TOOL = gql`
  mutation CreateTool($input: CreateToolInput!) {
    createTool(input: $input) {
      id
      name
      description
      function
      price
      serialNumber
      imageData
      createdAt
    }
  }
`;

export const UPDATE_TOOL = gql`
  mutation UpdateTool($id: ID!, $input: UpdateToolInput!) {
    updateTool(id: $id, input: $input) {
      id
      name
      description
      function
      price
      serialNumber
      imageData
      updatedAt
    }
  }
`;

export const DELETE_TOOL = gql`
  mutation DeleteTool($id: ID!) {
    deleteTool(id: $id) {
      id
      isDeleted
    }
  }
`;

export const RESTORE_TOOL = gql`
  mutation RestoreTool($id: ID!) {
    restoreTool(id: $id) {
      id
      isDeleted
    }
  }
`;

// PROJECT OPERATIONS
export const GET_PROJECTS = gql`
  query GetProjects($includeDeleted: Boolean) {
    projects(includeDeleted: $includeDeleted) {
      id
      name
      description
      boards {
        id
        width
        thickness
        length
        quantity
        boardFeet
        lumberId
        lumber {
          id
          name
          costPerBoardFoot
        }
      }
      finishes {
        id
        name
        price
      }
      laborCost
      miscCost
      additionalNotes
      isDeleted
      totalBoardFeet
      materialCost
      finishCost
      totalCost
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      boards {
        id
        width
        thickness
        length
        quantity
        boardFeet
        lumberId
        lumber {
          id
          name
          costPerBoardFoot
          jankaRating
        }
      }
      finishes {
        id
        name
        price
        imageData
      }
      laborCost
      miscCost
      additionalNotes
      isDeleted
      totalBoardFeet
      materialCost
      finishCost
      totalCost
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      totalCost
      createdAt
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      totalCost
      updatedAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      isDeleted
    }
  }
`;

export const RESTORE_PROJECT = gql`
  mutation RestoreProject($id: ID!) {
    restoreProject(id: $id) {
      id
      isDeleted
    }
  }
`;

// SETTINGS OPERATIONS
export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      userId
      currency
      language
      themeMode
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      id
      currency
      language
      themeMode
      updatedAt
    }
  }
`;

// DASHBOARD OPERATIONS
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProjects
      totalLumber
      totalFinishes
      totalTools
      totalProjectCost
      totalBoardFeet
      avgCostPerBF
      totalToolsValue
    }
  }
`;
