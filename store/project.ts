import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import Project from "~/types/Project";
import {calcDeduction} from "~/libs/work";
import {$axios} from "~/libs/api";

interface IProjectStore {
  data: Project | null
}

interface updateParam {
  key: string
  value: string|number|undefined
}

@Module({ stateFactory: true, namespaced: true, name: 'project' })
export default class ProjectStore extends VuexModule implements IProjectStore {
  data: Project | null = null;

  @Mutation
  setProjectInfo (value: Project): void {
    this.data = value;
  }

  @Mutation
  updateProjectInfoMutation(param: updateParam) {
    if (this.data === null || typeof this.data === "undefined") return;
    // あんまイケてないかも
    if (param.key !== 'project_name' && param.key !== 'rest_time') {
      param.value = Number(param.value);
    }
    if (param.key !== 'project_name' && param.key !== 'reward_type' && param.key !== 'hourly_wage' && typeof param.value !== 'string') {
      const deduction = calcDeduction(param.key, this.data, param.value);
      this.data.deduction_unit_price = deduction.deduction_unit_price;
      this.data.over_unit_price = deduction.over_unit_price;
    }
    this.data[param.key] = param.value;
  }

  @Action
  async getProjectInfo(projectId: number) {
    const res = await $axios.$get('/api/v1/projects/' + projectId);
    this.setProjectInfo(res);
  }

  @Action
  updateProjectInfo(param: updateParam) {
    this.updateProjectInfoMutation(param);
  }
};
