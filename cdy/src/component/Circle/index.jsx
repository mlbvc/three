import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as dat from 'dat.gui';
import * as CONSTANT from '../../common/constant';
import reactLogo from '../../assets/react.svg';
// import hdr1 from '../../res/img/hdr1.exr';

const gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000 );
const axesHelper = new THREE.AxesHelper( 6 );
const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight('#ffffff');
const spotLight = new THREE.SpotLight('#ffffff');
directionalLight.position.set(10, 10, 10);

const renderer = new THREE.WebGL1Renderer();
const controls = new OrbitControls(camera, renderer.domElement);

const spherepGeometry = new THREE.SphereGeometry(2, 16, 16);
const planeGeometry = new THREE.PlaneGeometry(50, 50);

const rgbeloader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const blueTexture = textureLoader.load(reactLogo);
const envMapTexture = cubeTextureLoader.load([
  CONSTANT.POSX,
  CONSTANT.NEGX,
  CONSTANT.POSY,
  CONSTANT.NEGY,
  CONSTANT.POSZ,
  CONSTANT.NEGZ
])
envMapTexture.minFilter = THREE.NearestFilter

const sphereMeterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  // wireframe: true,
  map: blueTexture,
  // envMap: envMapTexture, // 环境贴图设置则替代scene.environment
  metalness: 0.7,
  roughness: 0.1,
  side: THREE.DoubleSide
});

const planeMeterial = new THREE.MeshStandardMaterial({
  color: '#eeeeee',
  metalness: 0.7,
  roughness: 0.1,
  side: THREE.DoubleSide
});

const sphere = new THREE.Mesh(spherepGeometry, sphereMeterial);
const plane = new THREE.Mesh(planeGeometry, planeMeterial);

const Circle = (props) => {
  const init = () => {
    camera.position.set(0, 0, 10);
   
    sphere.castShadow = true;
    plane.receiveShadow = true;
    plane.position.set(0, -2, 0)
    plane.rotation.x = -Math.PI / 2
    //planeGeometry.translate(0, 0, -1.8)
    //planeGeometry.rotateX(-Math.PI / 2);

    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 20;
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;

    spotLight.target = sphere;
    spotLight.position.set(5 ,5, 5)
    spotLight.castShadow = true;
    spotLight.shadow.radius = 20;
    spotLight.shadow.mapSize.set(2048, 2048);

    scene.add(camera).add(sphere).add(plane).add(axesHelper).add(spotLight);
    scene.background = envMapTexture;
    scene.environment = envMapTexture;
    //rgbeloader.setRequestHeader({}).loadAsync(hdr1).then((texture) => {
    //texture.mapping = THREE.EquirectangularRefractionMapping;
    //scene.background = texture
    //})

    controls.update();

    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    render();
  }

  const render = () => {
    window.requestAnimationFrame(render)
    renderer.render(scene, camera);
  }

  const initGUI = () => {
    //gui.add(sphere.position, 'x', 0, 6, 0.1).name('物体x轴坐标');
    //gui.add(sphere.position, 'y', 0, 6, 0.1).name('物体y轴坐标');
    //gui.add(sphere.position, 'z', 0, 6, 0.1).name('物体z轴坐标');
    // gui.add(sphere.scale, 'x', 0, 1, 0.1).name('物体x缩放');
    gui.add(sphere.position, 'x').min(1).max(6).step(0.1).name('物体x轴坐标');
    gui.add(sphere.position, 'y').min(1).max(6).step(0.1).name('物体y轴坐标');
    gui.add(sphere.position, 'z').min(1).max(6).step(0.1).name('物体z轴坐标');
    gui.add(directionalLight.shadow.camera, 'near').min(0).max(100).step(0.1).name('光照距离').onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });
    gui.add(directionalLight.shadow.camera, 'far').min(1).max(1000).step(1).name('光照距离').onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });
    let palette = {
      color: '#FF0000', // CSS string
      color1: '#000fff'
    };
    gui.addColor(palette, 'color').name('设置物体颜色').onChange((value) => {
      sphere.material.color.set(value);
    })
    gui.addColor(palette, 'color1').name('设置平面颜色').onChange((value) => {
      plane.material.color.set(value);
    })
    let folder = gui.addFolder('设置物体');
    folder.add(sphere.material, 'wireframe').name('是否渲染线框')
    folder.add(sphere, 'visible').name('是否显示');
  }

  useEffect(()=> {
    init();
    initGUI();
  }, [init, initGUI])

  return (
    <div>
    </div>
  )
}
export default Circle